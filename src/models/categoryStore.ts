import db from '../lib/config/database';
import { Category, CategoryUpdate } from '../types/index';

export default class CategoryStore {
  async index(): Promise<Category[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM categories;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Categories. Error: ${err}`);
    }
  }

  async create(category: Category): Promise<Category> {
    try {
      const sql =
        'INSERT INTO categories (name, parent, icon, created) VALUES ($1, $2, $3, $4) RETURNING *;';

      const conn = await db.connect();
      const result = await conn.query(sql, [
        category.name,
        category.parent,
        category.icon,
        category.created
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add Category ${category.name}. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Category> {
    try {
      const sql = 'SELECT * FROM categories WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Category # ${id} Error: ${err}`);
    }
  }

  async update(category: CategoryUpdate): Promise<Category> {
    try {
      const valuesArray = [];
      let innerSql = '';
      let count = 0;

      if (category.name != undefined) {
        count++;
        valuesArray.push(category.name);
        innerSql += 'name=$' + count + ',';
      }

      if (category.parent != undefined) {
        count++;
        valuesArray.push(category.parent);
        innerSql += 'parent=$' + count + ',';
      }

      if (category.icon != undefined) {
        count++;
        valuesArray.push(category.icon);
        innerSql += 'icon=$' + count + ',';
      }

      if (count >= 1) {
        count++;
        valuesArray.push(category.id);
        innerSql = innerSql.slice(0, innerSql.length - 1);
        innerSql += ' WHERE id=$' + count;
        const sql = 'UPDATE categories SET ' + innerSql + ' RETURNING *;';

        const conn = await db.connect();

        const result = await conn.query(sql, valuesArray);

        conn.release();

        return result.rows[0];
      } else {
        throw new Error(
          `There is no data to update is provided for Category ${category.id}`
        );
      }
    } catch (err) {
      throw new Error(
        `Could not update Category ${category.id}. Error: ${err}`
      );
    }
  }

  async delete(id: number): Promise<Category> {
    try {
      const sql = 'DELETE FROM categories WHERE id=$1 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete Category # ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE categories CASCADE;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
