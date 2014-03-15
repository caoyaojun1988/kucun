package com.cao.stock.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cao.stock.domain.Account;
import com.cao.stock.persistence.AccountMapper;

/**
 * TODO Comment of AccountService
 * 
 * @author caoyaojun
 */
@Service
public class AccountService {

    @Autowired
    private AccountMapper accountMapper;

    public Account getAccountByUsernameAndPassword(Account account) {
        return accountMapper.getAccountByUsernameAndPassword(account);
    }

}
