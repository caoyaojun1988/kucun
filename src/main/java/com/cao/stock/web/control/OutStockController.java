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

import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.service.OutStockService;
import com.cao.stock.service.StockOrderService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.ExcelUtil;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/outStock")
public class OutStockController {

    @Autowired
    private OutStockService    outStockService;
    @Autowired
    private StockOrderService  stockOrderService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    HashMap<String, Object> listAllOutStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<OutStock> stocks = outStockService.listAllOutStocks(queryParameter);
        int count = outStockService.countAllOutStocks(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/add")
    @Transactional
    public @ResponseBody
    Result addOutStocks(@RequestParam("outStockMark") String outStockMark,
                        @RequestParam("createDate") String createDate, @RequestParam("staff") Integer staff,
                        @RequestParam("department") Integer department, @RequestParam("method") String method) {
        try {
            if (!"add".equals(method)) {
                return Result.failureResult("add in stock parameter Error :" + method);
            }
            return outStocks(outStockMark, createDate, department, staff);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    @Transactional
    public @ResponseBody
    Result updateOutStocks(@RequestParam(value = "outStockMark", required = false) String outStockMark,
                           @RequestParam(value = "createDate", required = false) String createDate,
                           @RequestParam(value = "staff", required = false) Integer staff,
                           @RequestParam(value = "department", required = false) Integer department,
                           @RequestParam(value = "method", required = false) String method) {
        try {
            if ("add".equals(method)) {
                return outStocks(outStockMark, createDate, department, staff);
            } else {
                String parameter = request.getReader().readLine();
                List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);
                String orderId = "";
                for (OutStock outStock : outStocks) {
                    if (outStocks == null || outStock.getStock() == null) {
                        continue;
                    }
                    OutStock oldOutStock = outStockService.queryOutStockById(outStock.getId());
                    orderId = oldOutStock.getOrderId();
                    outStockService.modifyOutStock(oldOutStock, outStock);
                }
                // 修改订单
                StockOrder stockOrder = outStockService.sumInStockByOrderId(orderId);
                stockOrderService.modifyStockOrderByid(stockOrder);
            }
            return Result.successResult();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    private Result outStocks(String outStockMark, String createDate, Integer department, Integer staff)
                                                                                                       throws IOException,
                                                                                                       ParseException {
        String parameter = request.getReader().readLine();
        List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);
        String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());

        StockOrder stockOrder = new StockOrder();
        stockOrder.setId(orderId);
        stockOrder.setCreateDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(createDate));
        stockOrder.setModifyDate(new Date());
        stockOrder.setStaff(staff);
        stockOrder.setStatus("out");
        stockOrder.setDepartment(department);
        stockOrder.setMark(outStockMark);
        Double totalworth = 0D;
        Integer totalNumber = 0;

        for (OutStock outStock : outStocks) {
            if (outStock != null && outStock.getStock() != null) {
                outStock.setOrderId(orderId);
                outStockService.addOutStock(outStock);
                totalNumber++;
                totalworth += outStock.getWorth();
            }
        }

        stockOrder.setTotalNumber(totalNumber);
        stockOrder.setTotalWorth(totalworth);
        stockOrderService.addStockOrder(stockOrder);
        return Result.successResult();
    }

    @RequestMapping("/delete")
    @Transactional
    public @ResponseBody
    Result deleteOutStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);
            String orderId = "";
            for (OutStock outStock : outStocks) {
                if (outStock == null || outStock.getId() == null) {
                    continue;
                }
                OutStock oldOutStock = outStockService.queryOutStockById(outStock.getId());

                outStock.setNumber(0);
                outStock.setWorth(0D);

                orderId = oldOutStock.getOrderId();
                outStockService.modifyOutStock(oldOutStock, outStock);
            }
            // 修改订单
            StockOrder stockOrder = outStockService.sumInStockByOrderId(orderId);
            stockOrderService.modifyStockOrderByid(stockOrder);
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/import")
    public @ResponseBody
    Result importInStocks(@RequestParam("upfile") CommonsMultipartFile uploadExcel) throws Exception {
        try {
            List<OutStock> inStocks = this.importExcel(uploadExcel.getInputStream()); // 读取数据（读取数据的源Excel，读取数据忽略的行数）
            Result result = Result.successResult();
            result.setValue(inStocks);
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    private List<OutStock> importExcel(InputStream inputStream) throws IOException {
        List<OutStock> result = new ArrayList<OutStock>();
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
                OutStock outStock = new OutStock();
                outStock.setCreateDate(new Date());
                outStock.setModifyDate(new Date());
                // 获得行row对象
                HSSFRow row = sheet.getRow(rowIndex);
                // 如果此行为空，则进入下一个循环
                if (row == null) {
                    continue;
                }

                HSSFCell cell = row.getCell(1);
                String tempResult = ExcelUtil.getString(cell);
                outStock.setStock(Double.valueOf(tempResult).intValue());

                cell = row.getCell(5);
                tempResult = ExcelUtil.getString(cell);
                outStock.setNumber(Double.valueOf(tempResult).intValue());
                result.add(outStock);
            }
        }
        return result;
    }
}
