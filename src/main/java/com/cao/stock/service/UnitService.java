package com.cao.stock.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
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

    public Unit queryUnitByUid(Integer Uid) {
        return unitMapper.queryUnitByUid(Uid);
    }

    @Transactional
    public Unit addOrModifyUnit(Unit unit) {
        Unit addUnit = unitMapper.queryUnitByUid(unit.getUid());
        if (addUnit == null || StringUtils.isBlank(addUnit.getId())) {
            unitMapper.addUnit(unit);
        } else {
            unitMapper.modifyUnitByUid(unit);
        }
        return unitMapper.queryUnitByUid(unit.getUid());
    }

    @Transactional
    public void deleteUnitByUid(Integer Uid) {
        unitMapper.deleteUnitByUid(Uid);

    }
}
