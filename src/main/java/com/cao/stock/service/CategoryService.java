package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.Category;
import com.cao.stock.persistence.CategoryMapper;

/**
 * TODO Comment of CategoryService
 * 
 * @author caoyaojun
 */
@Service
public class CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    public List<Category> listAllCategorys() {
        return categoryMapper.listAllCategorys();
    }

    public Category queryCategoryById(Integer uid) {
        return categoryMapper.queryCategoryByUid(uid);
    }

    @Transactional
    public Category addOrModifyCategory(Category category) {
        Category addCategory = categoryMapper.queryCategoryByUid(category.getUid());
        if (addCategory == null || addCategory.getId() == null) {
            categoryMapper.addCategory(category);
        } else {
            categoryMapper.modifyCategoryByUid(category);
        }
        return categoryMapper.queryCategoryByUid(category.getUid());
    }

    @Transactional
    public void deleteCategoryByUid(Integer uid) {
        categoryMapper.deleteCategoryByUid(uid);

    }

}
