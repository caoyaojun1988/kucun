package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.Staff;

/**
 * TODO Comment of StaffMapper
 * 
 * @author caoyaojun
 */
public interface StaffMapper {

    public List<Staff> listAllStaffs();

    public Staff queryStaffById(Integer id);

    public void addStaff(Staff staff);

    public void deleteStaffById(Integer id);

    public void modifyStaffById(Staff staff);
}
