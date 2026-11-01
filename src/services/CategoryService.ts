import { ProductCategory } from '../types/product';
import { CATEGORIES_DATA, CategoryMetadata } from '../data/mockCategories';

export interface ICategoryService {
  getAllCategories(): Promise<CategoryMetadata[]>;
  getCategoryById(id: ProductCategory): Promise<CategoryMetadata | null>;
}

class MockCategoryService implements ICategoryService {
  async getAllCategories(): Promise<CategoryMetadata[]> {
    return Object.values(CATEGORIES_DATA);
  }

  async getCategoryById(id: ProductCategory): Promise<CategoryMetadata | null> {
    return CATEGORIES_DATA[id] || null;
  }
}

export const CategoryService: ICategoryService = new MockCategoryService();
