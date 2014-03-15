package com.cao.stock.web.domain;

/**
 * TODO Comment of Result
 * 
 * @author caoyaojun
 */
public class Result {

    private boolean success;
    private String  msg;
    private Object  value;

    public static Result successResult() {
        Result result = new Result();
        result.setSuccess(true);
        result.setMsg("ok");
        return result;
    }

    public static Result failureResult(String errorMsg) {
        Result result = new Result();
        result.setSuccess(false);
        result.setMsg(errorMsg);
        return result;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }
}
