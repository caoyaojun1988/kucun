package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.Staff;
import com.cao.stock.persistence.StaffMapper;

/**
 * TODO Comment of StaffService
 * 
 * @author caoyaojun
 */
@Service
public class StaffService {

    @Autowired
    private StaffMapper staffMapper;

    public List<Staff> listAllStaffs() {
        return staffMapper.listAllStaffs();
    }

    public Staff queryStaffById(Integer id) {
        return staffMapper.queryStaffById(id);
    }

    @Transactional
    public Staff addOrModifyStaff(Staff staff) {
        Staff addStaff = staffMapper.queryStaffById(staff.getId());
        if (addStaff == null || addStaff.getId() == null) {
            staffMapper.addStaff(staff);
        } else {
            staffMapper.modifyStaffById(staff);
        }
        return staffMapper.queryStaffById(staff.getId());
    }

    @Transactional
    public void deleteStaffById(Integer id) {
        staffMapper.deleteStaffById(id);

    }

}
