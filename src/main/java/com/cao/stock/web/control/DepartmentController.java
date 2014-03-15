package com.cao.stock.web.control;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.Department;
import com.cao.stock.service.DepartmentService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/department")
public class DepartmentController {

    @Autowired
    private DepartmentService  departmentService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    List<Department> listAllDepartments() {
        List<Department> department = departmentService.listAllDepartments();
        return department;
    }

    @RequestMapping("/add")
    public @ResponseBody
    Result addDepartments() {
        try {
            String parameter = request.getReader().readLine();
            List<Department> departments = parseJson.parse(parameter, Department.class);
            for (Department department : departments) {
                if (department == null || StringUtils.isBlank(department.getName())) {
                    continue;
                }
                departmentService.addOrModifyDepartment(department);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteDepartments() {
        try {
            String parameter = request.getReader().readLine();
            List<Department> departments = parseJson.parse(parameter, Department.class);
            for (Department department : departments) {
                if (department == null || department.getId() == null) {
                    continue;
                }
                departmentService.deleteDepartmentById(department.getId());
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateDepartments() {
        try {
            String parameter = request.getReader().readLine();
            List<Department> departments = parseJson.parse(parameter, Department.class);

            for (Department department : departments) {
                if (department == null || StringUtils.isBlank(department.getName())) {
                    continue;
                }
                departmentService.addOrModifyDepartment(department);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }
}
