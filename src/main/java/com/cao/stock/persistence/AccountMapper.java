package com.cao.stock.persistence;

import com.cao.stock.domain.Account;

/**
 * TODO Comment of AccountMapper
 * 
 * @author caoyaojun
 */
public interface AccountMapper {

    public Account getAccountByUsernameAndPassword(Account account);

}
