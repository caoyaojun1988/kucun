package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.Unit;

/**
 * TODO Comment of UnitMapper
 * 
 * @author caoyaojun
 */
public interface UnitMapper {

    public List<Unit> listAllUnits();

    public void addUnit(Unit unit);

    public Unit queryUnitById(Integer id);

    public void deleteUnitById(Integer id);

    public void modifyUnitById(Unit unit);
}
