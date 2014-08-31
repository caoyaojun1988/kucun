package com.cao.stock.web.control;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.cao.stock.domain.Category;
import com.cao.stock.domain.InStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.domain.Unit;
import com.cao.stock.service.CategoryService;
import com.cao.stock.service.InStockService;
import com.cao.stock.service.StockOrderService;
import com.cao.stock.service.StockService;
import com.cao.stock.service.UnitService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.ExcelUtil;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/inStock")
public class InStockController {

    @Autowired
    private InStockService     inStockService;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private StockOrderService  stockOrderService;
    @Autowired
    private StockService       stockService;
    @Autowired
    private UnitService        unitService;
    @Autowired
    private CategoryService    categoryService;

    @RequestMapping("/listAll")
    public
    @ResponseBody
    HashMap<String, Object> listAllInStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<InStock> stocks = inStockService.listAllInStocks(queryParameter);
        int count = inStockService.countAllInStocks(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/add")
    public
    @ResponseBody
    @Transactional
    Result addInstocks(@RequestParam(value = "instockWay", required = false) String instockWay,
                       @RequestParam(value = "inStockMark", required = false) String inStockMark,
                       @RequestParam(value = "createDate", required = false) String createDate,
                       @RequestParam(value = "department", required = false) Integer department,
                       @RequestParam(value = "staff", required = false) Integer staff,
                       @RequestParam(value = "method", required = false) String method,
                       @RequestParam(value = "orderId", required = false) String orderId) {
        try {
            if ("add".equals(method)) {
                String parameter = request.getReader().readLine();
                List<InStock> inStocks = parseJson.parse(parameter, InStock.class);
                return inStocks(inStocks, instockWay, inStockMark, createDate, department, staff);
            } else {
                String parameter = request.getReader().readLine();
                List<InStock> inStocks = parseJson.parse(parameter, InStock.class);
                StockOrder stockOrder = stockOrderService.queryStockOrderById(orderId);
                if (stockOrder != null) {
                    for (InStock inStock : inStocks) {
                        if (inStock == null || inStock.getStock() == null || inStock.getId() != null) {
                            continue;
                        }
                        inStock.setModifyDate(new Date());
                        inStock.setCreateDate(stockOrder.getCreateDate());
                        inStock.setOrderId(orderId);
                        inStock.setRemainderNumber(inStock.getNumber());
                        inStockService.addInStock(inStock);
                    }
                    // 修改订单
                    StockOrder newStockOrder = inStockService.sumInStockByOrderId(orderId);
                    stockOrderService.modifyStockOrderByid(newStockOrder);
                }
                return  Result.successResult();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    @Transactional
    public
    @ResponseBody
    Result updateinStocks(@RequestParam(value = "instockWay", required = false) String instockWay,
                          @RequestParam(value = "inStockMark", required = false) String inStockMark,
                          @RequestParam(value = "createDate", required = false) String createDate,
                          @RequestParam(value = "department", required = false) Integer department,
                          @RequestParam(value = "staff", required = false) Integer staff,
                          @RequestParam(value = "method", required = false) String method,
                          @RequestParam(value = "orderId", required = false) String orderId) {
        try {
            if ("add".equals(method)) {
                String parameter = request.getReader().readLine();
                List<InStock> inStocks = parseJson.parse(parameter, InStock.class);
                return inStocks(inStocks, instockWay, inStockMark, createDate, department, staff);
            } else {
                String parameter = request.getReader().readLine();
                List<InStock> inStocks = parseJson.parse(parameter, InStock.class);
                StockOrder stockOrder = stockOrderService.queryStockOrderById(orderId);
                if (stockOrder != null) {
                    for (InStock inStock : inStocks) {
                        if (inStock == null || inStock.getStock() == null) {
                            continue;
                        }
                        InStock oldInStock = inStockService.queryInStockById(inStock.getId());
                        inStockService.modifyInStock(oldInStock, inStock);
                    }
                    // 修改订单
                    StockOrder newStockOrder = inStockService.sumInStockByOrderId(orderId);
                    stockOrderService.modifyStockOrderByid(newStockOrder);
                }
            }
            return Result.successResult();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    private Result inStocks(List<InStock> inStocks, String instockWay, String inStockMark, String createDate,
                            Integer department, Integer staff) throws IOException, ParseException {

        if (inStocks == null || inStocks.isEmpty()) {
            return Result.successResult();
        }

        String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());

        StockOrder stockOrder = new StockOrder();
        stockOrder.setId(orderId);
        stockOrder.setCreateDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(createDate));
        stockOrder.setModifyDate(new Date());
        stockOrder.setDepartment(department);
        stockOrder.setStaff(staff);
        stockOrder.setMark(inStockMark);

        Double totalworth = 0D;
        Integer totalNumber = 0;

        for (InStock inStock : inStocks) {
            if (inStock == null || inStock.getStock() == null) {
                continue;
            }
            inStock.setOrderId(stockOrder.getId());
            if (StringUtils.isNotBlank(instockWay) && instockWay.equals("2")) {
                inStockService.addInOutStock(inStock, staff, department);
            } else {
                inStockService.addInStock(inStock);
            }

            totalNumber++;
            totalworth += inStock.getTotalWorth();
        }

        if (StringUtils.isNotBlank(instockWay) && instockWay.equals("2")) {
            stockOrder.setStatus("inout");
        } else {
            stockOrder.setStatus("in");
        }

        stockOrder.setTotalNumber(totalNumber);
        stockOrder.setTotalWorth(totalworth);
        stockOrderService.addStockOrder(stockOrder);

        return Result.successResult();
    }

    @RequestMapping("/delete")
    @Transactional
    public
    @ResponseBody
    Result deleteinStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<InStock> inStocks = parseJson.parse(parameter, InStock.class);
            String orderId = "";
            for (InStock inStock : inStocks) {
                if (inStock == null || inStock.getId() == null) {
                    continue;
                }

                InStock oldInStock = inStockService.queryInStockById(inStock.getId());
                orderId = oldInStock.getOrderId();
                inStock.setNumber(0);
                inStockService.modifyInStock(oldInStock, inStock);
            }
            // 修改订单
            StockOrder stockOrder = inStockService.sumInStockByOrderId(orderId);
            stockOrderService.modifyStockOrderByid(stockOrder);
            return Result.successResult();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/import")
    public
    @ResponseBody
    Result importInStocks(@RequestParam("upfile") CommonsMultipartFile uploadExcel) throws Exception {
        try {
            List<Stock> stocks = stockService.listAllStocks(new QueryParameter());
            List<Integer> stockIds = new ArrayList<Integer>();
            for (Stock stock : stocks) {
                stockIds.add(stock.getId());
            }
            List<InStock> inStocks = this.importExcel(uploadExcel.getInputStream(), stockIds); // 读取数据（读取数据的源Excel，读取数据忽略的行数）
            Result result = Result.successResult();
            result.setValue(inStocks);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    private List<InStock> importExcel(InputStream inputStream, List<Integer> stockIds) throws Exception {
        List<Unit> units = unitService.listAllUnits();
        HashMap<String, Integer> unitMap = new HashMap<String, Integer>();
        for (Unit unit : units) {
            unitMap.put(unit.getName(), unit.getId());
        }
        List<Category> categorys = categoryService.listAllCategorys();
        HashMap<String, Integer> categoryMap = new HashMap<String, Integer>();
        for (Category category : categorys) {
            categoryMap.put(category.getName(), category.getId());
        }
        List<InStock> result = new ArrayList<InStock>();
        // 获取工作薄workbook
        HSSFWorkbook workbook = new HSSFWorkbook(inputStream); // 读取文件流
        // 获得 sheet总数
        int sheetCount = workbook.getNumberOfSheets();
        // 遍历sheet
        for (int sheetIndex = 0; sheetIndex < sheetCount; sheetIndex++) {
            // 获得指定的sheet对象
            HSSFSheet sheet = workbook.getSheetAt(sheetIndex);
            // 获得本sheet的总行数
            int rowCount = sheet.getLastRowNum();
            // 如果没有数据
            if (rowCount < 2) {
                return result;
            }
            // 如果有数据 进入下边
            // 遍历行row ignoreRows忽略的行数。即标题行，不取
            for (int rowIndex = 1; rowIndex <= rowCount - 1; rowIndex++) {
                // 准备rowData 收集每一行数据
                InStock inStock = new InStock();
                inStock.setCreateDate(new Date());
                inStock.setModifyDate(new Date());
                // 获得行row对象
                HSSFRow row = sheet.getRow(rowIndex);
                // 如果此行为空，则进入下一个循环
                if (row == null) {
                    continue;
                }

                HSSFCell cell = row.getCell(1);
                String tempResult = ExcelUtil.getString(cell);
                inStock.setStock(Double.valueOf(tempResult).intValue());

                cell = row.getCell(5);
                tempResult = ExcelUtil.getString(cell);
                inStock.setNumber(Double.valueOf(tempResult).intValue());

                cell = row.getCell(6);
                tempResult = ExcelUtil.getString(cell);
                inStock.setWorth(Double.parseDouble(tempResult));

                cell = row.getCell(7);
                tempResult = ExcelUtil.getString(cell);
                inStock.setTotalWorth(Double.parseDouble(tempResult));
                result.add(inStock);

                if (!stockIds.contains(inStock.getStock())) {
                    Stock stock = new Stock();
                    stock.setId(inStock.getStock());
                    stock.setNumber(0);
                    stock.setWorth(0.0);

                    cell = row.getCell(2);
                    tempResult = ExcelUtil.getString(cell);
                    stock.setName(tempResult);

                    cell = row.getCell(3);
                    tempResult = ExcelUtil.getString(cell);
                    stock.setSpecification(tempResult);

                    cell = row.getCell(4);
                    tempResult = ExcelUtil.getString(cell);
                    if (unitMap.containsKey(tempResult)) {
                        stock.setUnit(unitMap.get(tempResult));
                    } else {
                        throw new IllegalArgumentException("新增物品请添加单位：" + tempResult);
                    }

                    cell = row.getCell(8);
                    tempResult = ExcelUtil.getString(cell);
                    if (categoryMap.containsKey(tempResult)) {
                        stock.setCategory(categoryMap.get(tempResult));
                    } else {
                        throw new IllegalArgumentException("新增物品请添加填写类目：" + stock.getId());
                    }
                    stockService.addOrModifyStock(stock);
                }
            }
        }
        return result;
    }
}
