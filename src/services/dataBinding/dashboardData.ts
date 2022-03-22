import db from '../../lib/config/database';
import { TopProduct, UserPendingCart, UserAll } from '../../types/index';

export default class DashBoardData {
  async topPurchasedProducts(limit = 5): Promise<TopProduct[]> {
    try {
      const conn = await db.connect();
      const sql =
        'SELECT products.*, t.product_count as count FROM products INNER JOIN top_purchased_products AS t ON t.product_id = products.id ORDER BY t.product_count DESC LIMIT $1;';
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Tob Purchased Products . Error: ${err}`);
    }
  }

  async topPendingProducts(limit = 5): Promise<TopProduct[]> {
    try {
      const conn = await db.connect();
      const sql =
        'SELECT products.*, t.product_count as count FROM products INNER JOIN top_pending_products AS t ON t.product_id = products.id ORDER BY t.product_count DESC LIMIT $1;';
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Tob Pending Products . Error: ${err}`);
    }
  }

  async pendingCarts(limit = 5): Promise<UserPendingCart[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM pending_carts LIMIT $1;';
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Tob Pending User Carts . Error: ${err}`);
    }
  }

  async topBuyer(limit = 5): Promise<UserAll[]> {
    try {
      const conn = await db.connect();
      const sql =
        'SELECT *  FROM user_view ORDER BY order_sum DESC, order_count DESC LIMIT $1;';
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Tob Buyers Data . Error: ${err}`);
    }
  }
}
