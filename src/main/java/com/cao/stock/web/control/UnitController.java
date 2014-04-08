package com.cao.stock.web.control;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.Unit;
import com.cao.stock.service.UnitService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/unit")
public class UnitController {

    @Autowired
    private UnitService        unitService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    List<Unit> listAllUnits() {
        List<Unit> units = unitService.listAllUnits();
        return units;
    }

    @RequestMapping("/add")
    public @ResponseBody
    Result addUnits() {
        try {
            String parameter = request.getReader().readLine();
            List<Unit> units = parseJson.parse(parameter, Unit.class);
            for (Unit unit : units) {
                if (unit == null || StringUtils.isBlank(unit.getName())) {
                    continue;
                }
                unitService.addOrModifyUnit(unit);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteUnits() {
        try {
            String parameter = request.getReader().readLine();
            List<Unit> units = parseJson.parse(parameter, Unit.class);
            for (Unit unit : units) {
                if (unit == null || unit.getId() == null) {
                    continue;
                }
                unitService.deleteUnitById(unit.getId());
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateUnits() {
        try {
            String parameter = request.getReader().readLine();
            List<Unit> units = parseJson.parse(parameter, Unit.class);

            for (Unit unit : units) {
                if (unit == null || unit.getId() == null || StringUtils.isBlank(unit.getName())) {
                    continue;
                }
                unitService.addOrModifyUnit(unit);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    public void setUnitService(UnitService unitService) {
        this.unitService = unitService;
    }

    public UnitService getUnitService() {
        return unitService;
    }

}
