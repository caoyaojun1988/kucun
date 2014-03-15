package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.Category;

/**
 * TODO Comment of CategoryMapper
 * 
 * @author caoyaojun
 */
public interface CategoryMapper {

    public List<Category> listAllCategorys();

    public Category queryCategoryByUid(Integer uid);

    public void addCategory(Category category);

    public void deleteCategoryByUid(Integer uid);

    public void modifyCategoryByUid(Category category);
}
