package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.Department;

/**
 * TODO Comment of UnitMapper
 * 
 * @author caoyaojun
 */
public interface DepartmentMapper {

    public List<Department> listAllDepartments();

    public Department queryDepartmentById(Integer id);

    public void addDepartment(Department department);

    public void deleteDepartmentById(Integer id);

    public void modifyDepartmentById(Department department);
}
