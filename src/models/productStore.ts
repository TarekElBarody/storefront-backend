import db from '../lib/config/database';
import { Product, ProductUpdate, ProductRes } from '../types/index';

export default class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM products;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Products. Error: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, description, category_id, price, stock, details, image, status, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;';

      const conn = await db.connect();
      const result = await conn.query(sql, [
        product.name,
        product.description,
        product.category_id,
        product.price,
        product.stock,
        product.details,
        product.image,
        product.status,
        product.created
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add Product ${product.name}. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Product # ${id} Error: ${err}`);
    }
  }

  async view(id: number): Promise<ProductRes> {
    try {
      const sql = 'SELECT * FROM product_view WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Product # ${id} Error: ${err}`);
    }
  }

  async update(product: ProductUpdate): Promise<Product> {
    try {
      const valuesArray = [];
      let innerSql = '';
      let count = 0;

      if (product.name != undefined) {
        count++;
        valuesArray.push(product.name);
        innerSql += 'name=$' + count + ',';
      }

      if (product.description != undefined) {
        count++;
        valuesArray.push(product.description);
        innerSql += 'description=$' + count + ',';
      }

      if (product.category_id != undefined) {
        count++;
        valuesArray.push(product.category_id);
        innerSql += 'category_id=$' + count + ',';
      }

      if (product.price != undefined) {
        count++;
        valuesArray.push(product.price);
        innerSql += 'price=$' + count + ',';
      }

      if (product.stock != undefined) {
        count++;
        valuesArray.push(product.stock);
        innerSql += 'stock=$' + count + ',';
      }

      if (product.details != undefined) {
        count++;
        valuesArray.push(product.details);
        innerSql += 'details=$' + count + ',';
      }

      if (product.image != undefined) {
        count++;
        valuesArray.push(product.image);
        innerSql += 'image=$' + count + ',';
      }

      if (product.status != undefined) {
        count++;
        valuesArray.push(product.status);
        innerSql += 'status=$' + count + ',';
      }

      if (count >= 1) {
        count++;
        valuesArray.push(product.id);
        innerSql = innerSql.slice(0, innerSql.length - 1);
        innerSql += ' WHERE id=$' + count;
        const sql = 'UPDATE products SET ' + innerSql + ' RETURNING *;';

        const conn = await db.connect();

        const result = await conn.query(sql, valuesArray);

        conn.release();

        return result.rows[0];
      } else {
        throw new Error(
          `There is no data to update is provided for Product ${product.id}`
        );
      }
    } catch (err) {
      throw new Error(`Could not update Product ${product.id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=$1 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete Product # ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE products CASCADE;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
