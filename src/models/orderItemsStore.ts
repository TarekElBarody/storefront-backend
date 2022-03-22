import db from '../lib/config/database';
import { OrderItems, OrderItemsUpdate, OrderItemsInsert } from '../types/index';

export default class OrderItemsStore {
  async index(order_id: number): Promise<OrderItems[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM order_items WHERE order_id=$1;';
      const result = await conn.query(sql, [order_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Order Items. Error: ${err}`);
    }
  }

  async indexAll(): Promise<OrderItems[]> {
    try {
      const conn = await db.connect();
      const sql =
        'SELECT id, order_id, product_id, status  FROM order_items ORDER BY order_id ASC, id ASC;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Order Items. Error: ${err}`);
    }
  }

  async create(orderItems: OrderItemsInsert): Promise<OrderItems> {
    try {
      const sql =
        'INSERT INTO order_items (order_id, product_id, product_info, qty, price, total, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;';

      const conn = await db.connect();
      const result = await conn.query(sql, [
        orderItems.order_id,
        orderItems.product_id,
        orderItems.product_info,
        orderItems.qty,
        orderItems.price,
        orderItems.total,
        orderItems.status
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not add Product ${orderItems.product_id} to Order. Error: ${err}`
      );
    }
  }

  async show(id: number, order_id: number): Promise<OrderItems> {
    try {
      const sql = 'SELECT * FROM order_items WHERE id=$1 AND order_id=$2;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id, order_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Item # ${id} From Order Error: ${err}`);
    }
  }

  async update(orderItems: OrderItemsUpdate): Promise<OrderItems> {
    try {
      const valuesArray = [];
      let innerSql = '';
      let count = 0;

      if (orderItems.qty != undefined) {
        count++;
        valuesArray.push(orderItems.qty);
        innerSql += 'qty=$' + count + ',';
      }

      if (orderItems.status != undefined) {
        count++;
        valuesArray.push(orderItems.status);
        innerSql += 'status=$' + count + ',';
      }

      if (count >= 1) {
        innerSql = innerSql.slice(0, innerSql.length - 1);

        count++;
        valuesArray.push(orderItems.id);
        innerSql += ' WHERE id=$' + count;

        count++;
        valuesArray.push(orderItems.order_id);
        innerSql += ' AND order_id=$' + count;

        const sql = 'UPDATE order_items SET ' + innerSql + ';';

        const conn = await db.connect();

        await conn.query(sql, valuesArray);

        const sql2 =
          'UPDATE order_items SET total=price * qty WHERE id=$1 AND order_id=$2 RETURNING *;';
        const result = await conn.query(sql2, [
          orderItems.id,
          orderItems.order_id
        ]);

        conn.release();

        return result.rows[0];
      } else {
        throw new Error(
          `There is no data to update is provided for Item ${orderItems.id} in Order`
        );
      }
    } catch (err) {
      throw new Error(
        `Could not update Item ${orderItems.id} in Order. Error: ${err}`
      );
    }
  }

  async delete(id: number, order_id: number): Promise<OrderItems> {
    try {
      const cartItem = await this.show(id, order_id);
      const sql =
        'DELETE FROM order_items WHERE id=$1 AND order_id=$2 RETURNING TRUE;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id, order_id]);

      conn.release();

      const res = Boolean(result.rows[0]);
      if (res) {
        return cartItem;
      } else {
        throw new Error(`Could not delete Item # ${id} in Order.`);
      }
    } catch (err) {
      throw new Error(`Could not delete Item # ${id} in Order. Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE order_items;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
