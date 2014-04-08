package com.cao.stock.web.control;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.cao.stock.domain.Category;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;
import com.cao.stock.domain.Unit;
import com.cao.stock.service.CategoryService;
import com.cao.stock.service.StockService;
import com.cao.stock.service.UnitService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/stock")
public class StockController {

    @Autowired
    private StockService       stockService;
    @Autowired
    private CategoryService    categoryService;
    @Autowired
    private UnitService        unitService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    HashMap<String, Object> listAllStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<Stock> stocks = stockService.listAllStocks(queryParameter);
        int count = stockService.countAllStocks(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/add")
    public @ResponseBody
    Result addStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<Stock> stocks = parseJson.parse(parameter, Stock.class);
            for (Stock stock : stocks) {
                if (stock == null || stock.getId() == null || StringUtils.isBlank(stock.getName())) {
                    continue;
                }
                stockService.addOrModifyStock(stock);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<Stock> stocks = parseJson.parse(parameter, Stock.class);
            for (Stock stock : stocks) {
                if (stock == null || stock.getId() == null) {
                    continue;
                }
                stockService.deleteStockByUid(stock.getUid());
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<Stock> stocks = parseJson.parse(parameter, Stock.class);
            for (Stock stock : stocks) {
                if (stock == null || stock.getId() == null || StringUtils.isBlank(stock.getName())) {
                    continue;
                }
                stockService.addOrModifyStock(stock);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/export")
    public @ResponseBody
    ModelAndView exportStock(HttpServletResponse response, @ModelAttribute("pojo") QueryParameter queryParameter)
                                                                                                                 throws IOException {
        response.setContentType("application/octet-stream;charset=utf-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode("export.csv", "UTF-8"));
        // 客户端不缓存
        response.addHeader("Pargam", "no-cache");
        response.addHeader("Cache-Control", "no-cache");
        exportExcel(response.getOutputStream(), queryParameter);

        response.getOutputStream().flush();
        response.getOutputStream().close();

        return null;
    }

    private void exportExcel(ServletOutputStream outputStream, QueryParameter queryParameter) throws IOException {

        HSSFWorkbook demoWorkBook = new HSSFWorkbook();
        HSSFSheet demoSheet = demoWorkBook.createSheet("data");
        HSSFRow headerRow = demoSheet.createRow(0);

        // 创建单元格样式对象
        HSSFCellStyle ztStyle = demoWorkBook.createCellStyle();
        // 创建字体对象
        Font ztFont = demoWorkBook.createFont();
        ztStyle.setFont(ztFont); // 将字体应用到样式上面

        String[] tableHeader = { "编号", "类目", "名称", "规格", "单位", "数量", "价值" };

        for (int i = 0; i < tableHeader.length; i++) {
            HSSFCell headerCell = headerRow.createCell(i, HSSFCell.ENCODING_UTF_16);
            headerCell.setCellValue(tableHeader[i]);
        }

        List<Stock> stocks = stockService.listAllStocks(queryParameter);

        List<Category> categories = categoryService.listAllCategorys();
        HashMap<Integer, String> categoryMap = new HashMap<Integer, String>();
        for (Category category : categories) {
            categoryMap.put(category.getId(), category.getName());
        }
        List<Unit> units = unitService.listAllUnits();
        HashMap<Integer, String> unitMap = new HashMap<Integer, String>();
        for (Unit unit : units) {
            unitMap.put(unit.getId(), unit.getName());
        }
        int rowIndex = 1;
        for (Stock stock : stocks) {
            HSSFRow row = demoSheet.createRow(rowIndex);

            HSSFCell cell = row.createCell(0, HSSFCell.ENCODING_UTF_16);
            cell.setCellValue(stock.getId());

            HSSFCell cell1 = row.createCell(1, HSSFCell.ENCODING_UTF_16);
            cell1.setCellValue(categoryMap.get(stock.getCategory()));

            HSSFCell cell2 = row.createCell(2, HSSFCell.ENCODING_UTF_16);
            cell2.setCellValue(stock.getName());

            HSSFCell cell3 = row.createCell(3, HSSFCell.ENCODING_UTF_16);
            cell3.setCellValue(stock.getSpecification());

            HSSFCell cell4 = row.createCell(4, HSSFCell.ENCODING_UTF_16);
            cell4.setCellValue(unitMap.get(stock.getUnit()));

            HSSFCell cell5 = row.createCell(5, HSSFCell.ENCODING_UTF_16);
            cell5.setCellValue(stock.getNumber());

            HSSFCell cell6 = row.createCell(6, HSSFCell.ENCODING_UTF_16);
            cell6.setCellValue(stock.getWorth());

            rowIndex++;
        }
        demoWorkBook.write(outputStream);
    }

    public void setStockService(StockService stockService) {
        this.stockService = stockService;
    }

    public StockService getStockService() {
        return stockService;
    }

}
