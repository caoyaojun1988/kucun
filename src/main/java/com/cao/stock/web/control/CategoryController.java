package com.cao.stock.web.control;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.Category;
import com.cao.stock.service.CategoryService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService    categoryService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    List<Category> listAllCategorys() {
        List<Category> categorys = categoryService.listAllCategorys();
        return categorys;
    }

    @RequestMapping("/add")
    public @ResponseBody
    Result addCategorys() {
        try {
            String parameter = request.getReader().readLine();
            List<Category> categorys = parseJson.parse(parameter, Category.class);
            for (Category category : categorys) {
                if (category == null || StringUtils.isBlank(category.getName())) {
                    continue;
                }
                categoryService.addOrModifyCategory(category);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteCategorys() {
        try {
            String parameter = request.getReader().readLine();
            List<Category> categorys = parseJson.parse(parameter, Category.class);
            for (Category category : categorys) {
                if (category == null || category.getUid() == null) {
                    continue;
                }
                categoryService.deleteCategoryByUid(category.getUid());
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateCategorys() {
        try {
            String parameter = request.getReader().readLine();
            List<Category> categorys = parseJson.parse(parameter, Category.class);

            for (Category category : categorys) {
                if (category == null || StringUtils.isBlank(category.getName())) {
                    continue;
                }
                categoryService.addOrModifyCategory(category);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    public void setCategoryService(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    public CategoryService getCategoryService() {
        return categoryService;
    }

}
