import db from '../lib/config/database';
import {
  Order,
  OrderUpdate,
  OrderInsert,
  OrderRes,
  OrderResUser
} from '../types/index';

export default class OrderStore {
  async index(): Promise<OrderRes[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM orders_view;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async userOrders(user_id: number): Promise<OrderResUser[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM orders_user_view WHERE user_id=$1;';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users orders. Error: ${err}`);
    }
  }

  async create(order: OrderInsert): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (user_id, qty_count, total, status, confirmed_by, confirmed_date, payment_type, note, created, user_info) \
      VALUES ($1, 0, 0, 1, 0, null, $2, $3, NOW(), \
      (SELECT json_build_object( \
        'id', id, \
        'first_name', first_name, \
        'last_name', last_name, \
        'birthday', birthday, \
        'email', email, \
        'mobile', mobile, \
        'created', created \
        ) from users WHERE id = $4)::JSON \
    ) RETURNING *";

      const conn = await db.connect();
      const result = await conn.query(sql, [
        order.user_id,
        order.payment_type,
        order.note,
        order.user_id
      ]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not Process New Order for user ${order.user_id} Error: ${err}`
      );
    }
  }

  async process(order: OrderInsert): Promise<OrderResUser> {
    try {
      const sql = 'SELECT create_order($1, $2, $3) AS id ;';

      const conn = await db.connect();
      const result = await conn.query(sql, [
        order.user_id,
        order.payment_type,
        order.note
      ]);

      conn.release();
      if (parseInt(result.rows[0].id)) {
        const newOrder = await this.show(parseInt(result.rows[0].id));
        return newOrder;
      } else {
        throw new Error(
          `Could not Process New Order for user ${order.user_id}`
        );
      }
    } catch (err) {
      throw new Error(
        `Could not Process New Order for user ${order.user_id} Error: ${err}`
      );
    }
  }

  async show(id: number): Promise<OrderResUser> {
    try {
      const sql = 'SELECT * FROM orders_user_view WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Order # ${id} Error: ${err}`);
    }
  }

  async showAdmin(id: number): Promise<OrderRes> {
    try {
      const sql = 'SELECT * FROM orders_view WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Order # ${id} Error: ${err}`);
    }
  }

  async update(order: OrderUpdate): Promise<OrderRes> {
    try {
      const valuesArray = [];
      let innerSql = '';
      let count = 0;

      if (order.status != undefined) {
        count++;
        valuesArray.push(order.status);
        innerSql += 'status=$' + count + ',';
      }

      if (order.confirmed_by != undefined) {
        count++;
        valuesArray.push(order.confirmed_by);
        innerSql += 'confirmed_by=$' + count + ',';
      }

      if (order.confirmed_date != undefined) {
        count++;
        valuesArray.push(order.confirmed_date);
        innerSql += 'confirmed_date=$' + count + ',';
      }

      if (order.payment_type != undefined) {
        count++;
        valuesArray.push(order.payment_type);
        innerSql += 'payment_type=$' + count + ',';
      }

      if (order.note != undefined) {
        count++;
        valuesArray.push(order.note);
        innerSql += 'note=$' + count + ',';
      }

      if (count >= 1) {
        innerSql = innerSql.slice(0, innerSql.length - 1);

        count++;
        valuesArray.push(order.id);
        innerSql += ' WHERE id=$' + count;

        const sql = 'UPDATE orders SET ' + innerSql + ' RETURNING *;';

        const conn = await db.connect();

        const result = await conn.query(sql, valuesArray);

        conn.release();
        return result.rows[0];
      } else {
        throw new Error(
          `There is no data to update is provided for Order # ${order.id} `
        );
      }
    } catch (err) {
      throw new Error(`Could not update Order # ${order.id} . Error: ${err}`);
    }
  }

  async delete(id: number): Promise<OrderRes> {
    try {
      const sql = 'DELETE FROM orders WHERE id=$1 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete Order # ${id} . Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE orders CASCADE;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
