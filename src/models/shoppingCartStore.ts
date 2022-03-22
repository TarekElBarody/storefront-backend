import db from '../lib/config/database';
import {
  ShoppingCart,
  ShoppingCartUpdate,
  ShoppingCartRes
} from '../types/index';

export default class ShoppingCartStore {
  async index(user_id: number): Promise<ShoppingCartRes[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM cart_view WHERE user_id=$1;';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Shopping Cat Items. Error: ${err}`);
    }
  }

  async create(shoppingCart: ShoppingCart): Promise<ShoppingCartRes> {
    try {
      const sql =
        'INSERT INTO shopping_cart (user_id, product_id, qty, note) VALUES ($1, $2, $3, $4) RETURNING *;';

      const conn = await db.connect();
      const result = await conn.query(sql, [
        shoppingCart.user_id,
        shoppingCart.product_id,
        shoppingCart.qty,
        shoppingCart.note
      ]);

      conn.release();

      const id = Number(result.rows[0].id);
      if (id > 0) {
        const cartItem = this.show(id, shoppingCart.user_id);
        return cartItem;
      } else {
        throw new Error(
          `Could not add Product ${shoppingCart.product_id} to Shopping Cat.`
        );
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not add Product ${shoppingCart.product_id} to Shopping Cat. Error: ${err}`
      );
    }
  }

  async show(id: number, user_id: number): Promise<ShoppingCartRes> {
    try {
      const sql = 'SELECT * FROM cart_view WHERE id=$1 AND user_id=$2;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id, user_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Item # ${id} From Shopping Cat Error: ${err}`);
    }
  }

  async update(shoppingCart: ShoppingCartUpdate): Promise<ShoppingCartRes> {
    try {
      const valuesArray = [];
      let innerSql = '';
      let count = 0;

      if (shoppingCart.qty != undefined) {
        count++;
        valuesArray.push(shoppingCart.qty);
        innerSql += 'qty=$' + count + ',';
      }

      if (shoppingCart.note != undefined) {
        count++;
        valuesArray.push(shoppingCart.note);
        innerSql += 'note=$' + count + ',';
      }

      if (count >= 1) {
        innerSql = innerSql.slice(0, innerSql.length - 1);

        count++;
        valuesArray.push(shoppingCart.id);
        innerSql += ' WHERE id=$' + count;

        count++;
        valuesArray.push(shoppingCart.user_id);
        innerSql += ' AND user_id=$' + count;

        const sql = 'UPDATE shopping_cart SET ' + innerSql + ' RETURNING *;';

        const conn = await db.connect();

        const result = await conn.query(sql, valuesArray);

        conn.release();

        const id = Number(result.rows[0].id);
        if (id > 0) {
          const cartItem = this.show(id, shoppingCart.user_id);
          return cartItem;
        } else {
          throw new Error(
            `Could not add Product ${shoppingCart.product_id} to Shopping Cat.`
          );
        }
      } else {
        throw new Error(
          `There is no data to update is provided for Item ${shoppingCart.id} in Shopping Cat`
        );
      }
    } catch (err) {
      throw new Error(
        `Could not update Item ${shoppingCart.id} in Shopping Cat. Error: ${err}`
      );
    }
  }

  async delete(id: number, user_id: number): Promise<ShoppingCartRes> {
    try {
      const cartItem = await this.show(id, user_id);
      const sql =
        'DELETE FROM shopping_cart WHERE id=$1 AND user_id=$2 RETURNING TRUE;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id, user_id]);

      conn.release();

      const res = Boolean(result.rows[0]);
      if (res) {
        return cartItem;
      } else {
        throw new Error(`Could not delete Item # ${id} in Shopping Cat.`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not delete Item # ${id} in Shopping Cat. Error: ${err}`
      );
    }
  }

  async empty(user_id: number): Promise<boolean> {
    try {
      const sql = 'DELETE FROM shopping_cart WHERE user_id=$1 RETURNING TRUE;';

      const conn = await db.connect();

      const result = await conn.query(sql, [user_id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not empty  Shopping Cat for user # ${user_id} in. Error: ${err}`
      );
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE shopping_cart;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
