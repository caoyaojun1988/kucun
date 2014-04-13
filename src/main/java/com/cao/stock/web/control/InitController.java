package com.cao.stock.web.control;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.Category;
import com.cao.stock.domain.Department;
import com.cao.stock.domain.InStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Staff;
import com.cao.stock.domain.Stock;
import com.cao.stock.domain.Unit;
import com.cao.stock.service.CategoryService;
import com.cao.stock.service.DepartmentService;
import com.cao.stock.service.InStockService;
import com.cao.stock.service.StaffService;
import com.cao.stock.service.StockService;
import com.cao.stock.service.UnitService;
import com.cao.stock.service.util.PinYinHelper;
import com.cao.stock.web.domain.Result;

@Controller
@RequestMapping("/init")
public class InitController {

    @Autowired
    private UnitService       unitService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private StaffService      staffService;
    @Autowired
    private CategoryService   categoryService;
    @Autowired
    private StockService      stockService;
    @Autowired
    private InStockService    inStockService;

    @RequestMapping("/initpingying")
    public @ResponseBody
    Result init() {
        List<Unit> units = unitService.listAllUnits();
        for (Unit unit : units) {
            unit.setPinyinForName(PinYinHelper.convert(unit.getName()));
            unitService.addOrModifyUnit(unit);
        }

        List<Department> departments = departmentService.listAllDepartments();
        for (Department department : departments) {
            department.setPinyinForName(PinYinHelper.convert(department.getName()));
            departmentService.addOrModifyDepartment(department);
        }

        List<Staff> staffs = staffService.listAllStaffs();
        for (Staff staff : staffs) {
            staff.setPinyinForName(PinYinHelper.convert(staff.getName()));
            staffService.addOrModifyStaff(staff);
        }

        List<Category> categorys = categoryService.listAllCategorys();
        for (Category category : categorys) {
            category.setPinyinForName(PinYinHelper.convert(category.getName()));
            categoryService.addOrModifyCategory(category);
        }

        List<Stock> stocks = stockService.listAllStocks(new QueryParameter());
        for (Stock stock : stocks) {
            stock.setPinyinForName(PinYinHelper.convert(stock.getName()));
            stockService.addOrModifyStock(stock);
        }

        return Result.successResult();

    }

    public void setUnitService(UnitService unitService) {
        this.unitService = unitService;
    }

    public UnitService getUnitService() {
        return unitService;
    }

}
