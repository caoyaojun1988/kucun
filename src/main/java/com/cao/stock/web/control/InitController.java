package com.cao.stock.web.control;

import java.util.ArrayList;
import java.util.List;

import com.cao.stock.domain.*;
import com.cao.stock.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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
    @Autowired
    private OutStockService   outStockService;

    @RequestMapping("/initpingying")
    public
    @ResponseBody
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
            stock.setPinyinForName(stock.getId() + "," + PinYinHelper.convert(stock.getName()));
            stockService.addOrModifyStock(stock);
        }

        return Result.successResult();

    }

    @RequestMapping("/debugdata")
    public
    @ResponseBody
    Result Debug() {
        QueryParameter queryParameter = new QueryParameter();
        List<Stock> stocks = stockService.listAllStocks(queryParameter);
        List<Integer> re = new ArrayList<Integer>();
        for (Stock stock : stocks) {
            QueryParameter queryParameter2 = new QueryParameter();
            queryParameter2.setStock(stock.getId());
            List<InStock> inStocks = inStockService.listAllInStocks(queryParameter2);
            double in_worth = 0;
            for (InStock inStock : inStocks) {
                in_worth += inStock.getTotalWorth();
            }

            //out
            QueryParameter queryParameter3 = new QueryParameter();
            queryParameter3.setStock(stock.getId());
            List<OutStock> outStocks = outStockService.listAllOutStocks(queryParameter3);
            double out_worth = 0;
            for (OutStock outStock : outStocks) {
                out_worth += outStock.getWorth();
            }

            if (Math.abs(in_worth - out_worth - stock.getWorth()) > 0.01) {
                re.add(stock.getId());
            }
        }
        return Result.failureResult(re.toString());
    }

    public void setUnitService(UnitService unitService) {
        this.unitService = unitService;
    }

    public UnitService getUnitService() {
        return unitService;
    }

}
