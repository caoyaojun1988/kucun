package com.cao.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.Unit;
import com.cao.stock.persistence.UnitMapper;

/**
 * TODO Comment of UnitService
 * 
 * @author caoyaojun
 */
@Service
public class UnitService {

    @Autowired
    private UnitMapper unitMapper;

    public List<Unit> listAllUnits() {
        return unitMapper.listAllUnits();
    }

    public Unit queryUnitByUid(Integer id) {
        return unitMapper.queryUnitById(id);
    }

    @Transactional
    public Unit addOrModifyUnit(Unit unit) {
        Unit addUnit = unitMapper.queryUnitById(unit.getId());
        if (addUnit == null || addUnit.getId() == null) {
            unitMapper.addUnit(unit);
        } else {
            unitMapper.modifyUnitById(unit);
        }
        return unitMapper.queryUnitById(unit.getId());
    }

    @Transactional
    public void deleteUnitById(Integer id) {
        unitMapper.deleteUnitById(id);

    }
}
