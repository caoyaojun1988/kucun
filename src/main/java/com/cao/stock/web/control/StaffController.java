package com.cao.stock.web.control;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.Staff;
import com.cao.stock.service.StaffService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private StaffService       staffService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    List<Staff> listAllStaffs() {
        List<Staff> staffs = staffService.listAllStaffs();
        return staffs;
    }

    @RequestMapping("/add")
    public @ResponseBody
    Result addStaffs() {
        try {
            String parameter = request.getReader().readLine();
            List<Staff> staffs = parseJson.parse(parameter, Staff.class);
            for (Staff staff : staffs) {
                if (staff == null || StringUtils.isBlank(staff.getName())) {
                    continue;
                }
                staffService.addOrModifyStaff(staff);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteStaffs() {
        try {
            String parameter = request.getReader().readLine();
            List<Staff> staffs = parseJson.parse(parameter, Staff.class);
            for (Staff staff : staffs) {
                if (staff == null || staff.getId() == null) {
                    continue;
                }
                staffService.deleteStaffById(staff.getId());
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateStaffs() {
        try {
            String parameter = request.getReader().readLine();
            List<Staff> staffs = parseJson.parse(parameter, Staff.class);

            for (Staff staff : staffs) {
                if (staff == null || StringUtils.isBlank(staff.getName())) {
                    continue;
                }
                staffService.addOrModifyStaff(staff);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    public void setStaffService(StaffService staffService) {
        this.staffService = staffService;
    }

    public StaffService getStaffService() {
        return staffService;
    }

}
