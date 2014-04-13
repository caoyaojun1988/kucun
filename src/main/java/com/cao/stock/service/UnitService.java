package com.cao.stock.service;

import java.util.List;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cao.stock.domain.Unit;
import com.cao.stock.persistence.UnitMapper;
import com.cao.stock.service.util.PinYinHelper;

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
        unit.setPinyinForName(PinYinHelper.convert(unit.getName()));

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
