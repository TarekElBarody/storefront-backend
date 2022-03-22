import CategoryStore from '../categoryStore';
import { Category, CategoryUpdate } from '../../types/index';
import { dateNow } from '../../lib/functions/general';

let categoryID = 0;
const created = dateNow();
const store = new CategoryStore();

describe('Test Category Model (categoryStoreSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await store.truncate();
  });

  it('Should Category Model CRUD functions are defined', async (): Promise<void> => {
    expect(store.create).toBeDefined();
    expect(store.index).toBeDefined();
    expect(store.show).toBeDefined();
    expect(store.update).toBeDefined();
    expect(store.delete).toBeDefined();
    expect(store.truncate).toBeDefined();
  });

  it('Should Insert New Category', async (): Promise<void> => {
    const category: Category = {
      name: 'Phones',
      parent: 0,
      icon: '/assets/icons/phone-icon.png',
      created: created
    };

    const categoryRes = await store.create(category);
    categoryID = Number(categoryRes.id);

    expect(categoryRes.name).toBe(category.name);
    expect(categoryID).toBeGreaterThan(0);
  });

  it('Should Return Category Data', async (): Promise<void> => {
    const categoryRes = await store.show(categoryID);

    expect(categoryRes.id).toEqual(categoryID);
  });

  it('Should Return All Category Data', async (): Promise<void> => {
    const categories = await store.index();

    const category = await store.show(categoryID);

    expect(categories).toContain(category);
  });

  it('Should update Category - Just Name', async (): Promise<void> => {
    // UPDATING THE VALUE
    const category: CategoryUpdate = {
      id: categoryID,
      name: 'Android Phones'
    };
    const categoryRes = await store.update(category);

    expect(categoryRes.name).toEqual(String(category.name));
  });

  it('Should Delete Category Data', async (): Promise<void> => {
    const categoryRes = await store.delete(categoryID);

    expect(categoryRes.id).toEqual(categoryID);
  });

  it('Should Truncate Category Data', async (): Promise<void> => {
    const res = await store.truncate();

    expect(res).toBeTrue();
  });
});
