/**
 * Techneyo MySQL Client Adapter
 * 
 * Routes all database queries and authentication to the MySQL database
 * through the Express backend API (/api/db & /api/auth).
 */

type Filter = {
  column: string;
  operator: string;
  value: any;
};

type Order = {
  column: string;
  ascending?: boolean;
};

export class MySQLQueryBuilder implements PromiseLike<any> {
  private table: string;
  private action: "select" | "insert" | "update" | "delete" = "select";
  private columns: string = "*";
  private filters: Filter[] = [];
  private orderConfig: Order | null = null;
  private limitCount: number | null = null;
  private offsetCount: number | null = null;
  private isSingle: boolean = false;
  private isCountOnly: boolean = false;
  private payload: any = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = "*", options?: { count?: string; head?: boolean }) {
    this.columns = columns;
    if (options?.count === "exact" && options?.head === true) {
      this.isCountOnly = true;
    }
    return this;
  }

  insert(values: any) {
    this.action = "insert";
    this.payload = values;
    return this;
  }

  update(values: any) {
    this.action = "update";
    this.payload = values;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: "=", value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ column, operator: "!=", value });
    return this;
  }

  like(column: string, pattern: string) {
    this.filters.push({ column, operator: "like", value: pattern });
    return this;
  }

  ilike(column: string, pattern: string) {
    this.filters.push({ column, operator: "ilike", value: pattern });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ column, operator: "in", value: values });
    return this;
  }

  is(column: string, value: any) {
    this.filters.push({ column, operator: "is", value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderConfig = { column, ascending: options?.ascending !== false };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = to - from + 1;
    return this;
  }

  single() {
    this.isSingle = true;
    this.limitCount = 1;
    return this;
  }

  maybeSingle() {
    this.isSingle = true;
    this.limitCount = 1;
    return this;
  }

  async execute(): Promise<any> {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("techneyo_admin_token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (this.isCountOnly) {
        const res = await fetch("/api/db/count", {
          method: "POST",
          headers,
          body: JSON.stringify({
            table: this.table,
            filters: this.filters,
          }),
        });
        const json = await res.json();
        return { count: json.count ?? 0, data: null, error: json.error || null };
      }

      if (this.action === "select") {
        const res = await fetch("/api/db/select", {
          method: "POST",
          headers,
          body: JSON.stringify({
            table: this.table,
            columns: this.columns,
            filters: this.filters,
            order: this.orderConfig,
            limit: this.limitCount,
            offset: this.offsetCount,
            single: this.isSingle,
          }),
        });
        const json = await res.json();
        return { data: json.data, error: json.error || null };
      }

      if (this.action === "insert") {
        const res = await fetch("/api/db/insert", {
          method: "POST",
          headers,
          body: JSON.stringify({
            table: this.table,
            rows: this.payload,
          }),
        });
        const json = await res.json();
        return { data: json.data, error: json.error || null };
      }

      if (this.action === "update") {
        const res = await fetch("/api/db/update", {
          method: "POST",
          headers,
          body: JSON.stringify({
            table: this.table,
            values: this.payload,
            filters: this.filters,
          }),
        });
        const json = await res.json();
        return { data: json.data, error: json.error || null };
      }

      if (this.action === "delete") {
        const res = await fetch("/api/db/delete", {
          method: "POST",
          headers,
          body: JSON.stringify({
            table: this.table,
            filters: this.filters,
          }),
        });
        const json = await res.json();
        return { error: json.error || null };
      }
    } catch (err: any) {
      return { data: null, error: { message: err.message || "MySQL API error" } };
    }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

type AuthListener = (event: string, session: any) => void;
const authListeners = new Set<AuthListener>();

const notifyAuth = (event: string, session: any) => {
  authListeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch {}
  });
};

const auth = {
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        return { data: { user: null, session: null }, error: { message: json.error || "Invalid email or password" } };
      }

      const session = {
        access_token: json.token,
        user: json.user,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("techneyo_admin_token", json.token);
        localStorage.setItem("techneyo_admin_user", JSON.stringify(json.user));
      }

      notifyAuth("SIGNED_IN", session);
      return { data: { user: json.user, session }, error: null };
    } catch (err: any) {
      return { data: { user: null, session: null }, error: { message: err.message } };
    }
  },

  async getSession() {
    if (typeof window === "undefined") {
      return { data: { session: null }, error: null };
    }

    const token = localStorage.getItem("techneyo_admin_token");
    const userStr = localStorage.getItem("techneyo_admin_user");

    if (!token || !userStr) {
      return { data: { session: null }, error: null };
    }

    try {
      const user = JSON.parse(userStr);
      const session = {
        access_token: token,
        user,
      };
      return { data: { session }, error: null };
    } catch {
      return { data: { session: null }, error: null };
    }
  },

  async getUser() {
    const sessionRes = await this.getSession();
    return { data: { user: sessionRes.data.session?.user || null }, error: null };
  },

  async signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("techneyo_admin_token");
      localStorage.removeItem("techneyo_admin_user");
    }
    notifyAuth("SIGNED_OUT", null);
    return { error: null };
  },

  onAuthStateChange(callback: AuthListener) {
    authListeners.add(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => authListeners.delete(callback),
        },
      },
    };
  },
};

export const isDatabaseConfigured = true;

export const db = {
  from: (table: string) => new MySQLQueryBuilder(table),
  auth,
};
