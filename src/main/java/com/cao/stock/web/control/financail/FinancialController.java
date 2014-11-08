package com.cao.stock.web.control.financail;

import com.cao.stock.domain.*;
import com.cao.stock.service.*;
import com.cao.stock.web.control.financail.main.Main;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.*;
import com.cao.stock.web.util.parseJson;
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
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping("/financial")
public class FinancialController {
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/create")
    public
    @ResponseBody
    Result importInStocks(@RequestParam("defaultDir") String defaultDir, @RequestParam("mothNumber") int mothNumber,
                          @RequestParam(value = "templateFile", required = false) CommonsMultipartFile templateFileExcel,
                          @RequestParam(value = "dnzzFile", required = false) CommonsMultipartFile dnzzFileExcel,
                          @RequestParam(value = "dyzzFile", required = false) CommonsMultipartFile dyzzFileExcel,
                          @RequestParam(value = "dyjbFile", required = false) CommonsMultipartFile dyjbFileExcel,
                          @RequestParam(value = "dyxmFile", required = false) CommonsMultipartFile dyxmFileExcel,
                          @RequestParam(value = "xmmxFile", required = false) CommonsMultipartFile xmmxFileExcel) throws Exception {
        try {
            Main main = new Main();
            String rootPath = request.getSession().getServletContext().getRealPath("/") + "../../data/";
            String descurl = rootPath + mothNumber + "/result.xls";
            if (StringUtils.equals(defaultDir, "true")) {
                InputStream templateFile = new FileInputStream(new File(rootPath + "template-new.xls"));
                InputStream dnzzFile = new FileInputStream(new File(rootPath + mothNumber + "/dnzz.xls"));
                InputStream dyzzFile = new FileInputStream(new File(rootPath + mothNumber + "/dyzz.xls"));
                InputStream dyjbFile = new FileInputStream(new File(rootPath + mothNumber + "/dyjb.xls"));
                InputStream dyxmFile = new FileInputStream(new File(rootPath + mothNumber + "/dyxm.xls"));
                InputStream xmmxFile = new FileInputStream(new File(rootPath + mothNumber + "/xmmx.xls"));
                main.ToOpen(templateFile, dnzzFile, dyzzFile, dyjbFile, dyxmFile, xmmxFile, descurl);
                return Result.successResult();
            } else {
                main.ToOpen(templateFileExcel.getInputStream(), dnzzFileExcel.getInputStream(), dyzzFileExcel.getInputStream(), dyjbFileExcel.getInputStream(), dyxmFileExcel.getInputStream(), xmmxFileExcel.getInputStream(), descurl);
                return Result.successResult();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }


    @RequestMapping("/export")
    public
    @ResponseBody
    ModelAndView exportStock(HttpServletResponse response, @RequestParam("mothNumber") int mothNumber)
      throws IOException {
        response.setContentType("application/octet-stream;charset=utf-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode("export.xls", "UTF-8"));

        // 客户端不缓存
        response.addHeader("Pargam", "no-cache");
        response.addHeader("Cache-Control", "no-cache");

        response.getOutputStream().flush();
        response.getOutputStream().close();

        return null;
    }

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }
}
