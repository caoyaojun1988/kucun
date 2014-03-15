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

    public Unit queryUnitByUid(Integer uId);

    public void addUnit(Unit unit);

    public void deleteUnitByUid(Integer uId);

    public void modifyUnitByUid(Unit unit);
}
