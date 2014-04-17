package com.cao.stock.web.control;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.InStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Staff;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.service.InStockService;
import com.cao.stock.service.StaffService;
import com.cao.stock.service.StockOrderService;
import com.cao.stock.service.util.NumberFormatHelper;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/inStock")
public class InStockController {

    @Autowired
    private InStockService     inStockService;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private StaffService       staffService;
    @Autowired
    private StockOrderService  stockOrderService;

    @RequestMapping("/listAll")
    public @ResponseBody
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
    public @ResponseBody
    @Transactional
    Result addInstocks(@RequestParam("instockWay") String instockWay, @RequestParam("inStockMark") String inStockMark,
                       @RequestParam("createDate") String createDate, @RequestParam("staff") Integer staff,
                       @RequestParam("method") String method) {
        try {
            if (!"add".equals(method)) {
                return Result.failureResult("add in stock parameter Error :" + method);
            }
            return inStocks(instockWay, inStockMark, createDate, staff);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    @Transactional
    public @ResponseBody
    Result updateinStocks(@RequestParam(value = "instockWay", required = false) String instockWay,
                          @RequestParam(value = "inStockMark", required = false) String inStockMark,
                          @RequestParam(value = "createDate", required = false) String createDate,
                          @RequestParam(value = "staff", required = false) Integer staff,
                          @RequestParam(value = "method",required=false) String method) {
        try {
            if ("add".equals(method)) {
                return inStocks(instockWay, inStockMark, createDate, staff);
            } else {
                String parameter = request.getReader().readLine();
                List<InStock> inStocks = parseJson.parse(parameter, InStock.class);
                for (InStock inStock : inStocks) {
                    if (inStock == null || inStock.getStock() == null) {
                        continue;
                    }
                    InStock oldInStock = inStockService.queryInStockById(inStock.getId());
                    inStockService.modifyInStock(oldInStock, inStock);
                }
            }
            return Result.successResult();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    private Result inStocks(String instockWay, String inStockMark, String createDate, Integer staff)
                                                                                                    throws IOException,
                                                                                                    ParseException {

        String parameter = request.getReader().readLine();
        List<InStock> inStocks = parseJson.parse(parameter, InStock.class);

        String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());

        StockOrder stockOrder = new StockOrder();
        stockOrder.setId(orderId);
        stockOrder.setCreateDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(createDate));
        stockOrder.setModifyDate(new Date());
        stockOrder.setStaff(staff);
        stockOrder.setMark(inStockMark);
        if (StringUtils.isNotBlank(instockWay) && instockWay.equals("2")) {
            stockOrder.setStatus("inout");
            addInOutStocks(inStocks, stockOrder);
        } else {
            Double totalworth = 0D;
            Integer totalNumber = 0;
            for (InStock inStock : inStocks) {
                if (inStock == null || inStock.getStock() == null) {
                    continue;
                }
                inStock.setOrderId(orderId);
                inStockService.addInStock(inStock);
                totalNumber++;
                totalworth += NumberFormatHelper.format(inStock.getWorth() * inStock.getNumber());
            }
            stockOrder.setStatus("in");
            stockOrder.setTotalNumber(totalNumber);
            stockOrder.setTotalWorth(totalworth);
            stockOrderService.addStockOrder(stockOrder);
        }
        return Result.successResult();
    }

    private void addInOutStocks(List<InStock> inStocks, StockOrder stockOrder) {
        if (inStocks == null || inStocks.isEmpty()) {
            return;
        }
        Staff staff = staffService.queryStaffById(inStocks.get(0).getStaff());
        Integer inOutStockStaff = staff.getId();
        Integer inOutDepartment = staff.getDepartment();

        Double totalworth = 0D;
        Integer totalNumber = 0;
        for (InStock inStock : inStocks) {
            if (inStock == null || inStock.getStock() == null) {
                continue;
            }
            inStock.setOrderId(stockOrder.getId());
            inStockService.addInOutStock(inStock, inOutStockStaff, inOutDepartment);
            totalNumber++;
            totalworth += NumberFormatHelper.format(inStock.getWorth() * inStock.getNumber());
        }
        stockOrder.setTotalNumber(totalNumber);
        stockOrder.setTotalWorth(totalworth);
        stockOrderService.addStockOrder(stockOrder);
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteinStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<InStock> inStocks = parseJson.parse(parameter, InStock.class);
            for (InStock inStock : inStocks) {
                if (inStock == null || inStock.getId() == null) {
                    continue;
                }

                InStock oldInStock = inStockService.queryInStockById(inStock.getId());

                inStock.setNumber(0);
                inStockService.modifyInStock(oldInStock, inStock);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }
}
