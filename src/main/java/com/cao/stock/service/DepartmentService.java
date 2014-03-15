package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.Department;
import com.cao.stock.persistence.DepartmentMapper;

/**
 * TODO Comment of DepartmentService
 * 
 * @author caoyaojun
 */
@Service
public class DepartmentService {

    @Autowired
    private DepartmentMapper departmentMapper;

    public List<Department> listAllDepartments() {
        return departmentMapper.listAllDepartments();
    }

    public Department queryDepartmentById(Integer id) {
        return departmentMapper.queryDepartmentById(id);
    }

    @Transactional
    public Department addOrModifyDepartment(Department department) {
        Department addDepartment = departmentMapper.queryDepartmentById(department.getId());
        if (addDepartment == null || addDepartment.getId() == null) {
            departmentMapper.addDepartment(department);
        } else {
            departmentMapper.modifyDepartmentById(department);
        }
        return departmentMapper.queryDepartmentById(department.getId());
    }

    @Transactional
    public void deleteDepartmentById(Integer id) {
        departmentMapper.deleteDepartmentById(id);

    }

}
