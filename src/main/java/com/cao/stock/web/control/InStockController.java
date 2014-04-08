package com.cao.stock.web.control;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.InStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.service.InStockService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/inStock")
public class InStockController {

    @Autowired
    private InStockService     inStockService;
    @Autowired
    private HttpServletRequest request;

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
    Result addInstocks(@RequestParam("instockWay") String instockWay,
                       @RequestParam("inOutStockStaff") String inOutStockStaff,
                       @RequestParam("inOutDepartment") String inOutDepartment) {
        try {
            String parameter = request.getReader().readLine();
            List<InStock> inStocks = parseJson.parse(parameter, InStock.class);

            if (StringUtils.isNotBlank(instockWay) && instockWay.equals("2")) {
                addInOutStocks(inStocks, inOutStockStaff, inOutDepartment);
            } else {
                String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
                for (InStock inStock : inStocks) {
                    if (inStock == null || inStock.getStock() == null) {
                        continue;
                    }
                    inStock.setOrderId(orderId);
                    inStockService.addInStock(inStock);
                }
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateinStocks(@RequestParam("instockWay") String instockWay,
                          @RequestParam("inOutStockStaff") String inOutStockStaff,
                          @RequestParam("inOutDepartment") String inOutDepartment) {
        try {
            String parameter = request.getReader().readLine();
            List<InStock> inStocks = parseJson.parse(parameter, InStock.class);

            if (StringUtils.isNotBlank(instockWay) && instockWay.equals("2")) {
                addInOutStocks(inStocks, inOutStockStaff, inOutDepartment);
            } else {
                String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
                for (InStock inStock : inStocks) {
                    if (inStock == null || inStock.getStock() == null) {
                        continue;
                    }

                    InStock oldInStock = inStockService.queryInStockById(inStock.getId());
                    if (oldInStock == null || oldInStock.getId() == null) {
                        inStock.setOrderId(orderId);
                        inStockService.addInStock(inStock);
                    } else {
                        inStockService.modifyInStock(oldInStock, inStock);
                    }
                }
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    private void addInOutStocks(List<InStock> inStocks, String inOutStockStaff, String inOutDepartment) {
        String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
        for (InStock inStock : inStocks) {
            if (inStock == null || inStock.getStock() == null) {
                continue;
            }
            inStock.setOrderId(orderId);
            inStockService.addInOutStock(inStock, inOutStockStaff, inOutDepartment);
        }
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
