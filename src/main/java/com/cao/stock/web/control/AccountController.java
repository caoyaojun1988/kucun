package com.cao.stock.web.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.cao.stock.domain.Account;
import com.cao.stock.service.AccountService;
import com.cao.stock.web.domain.Result;

@Controller
@RequestMapping("/account")
@SessionAttributes("user")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @RequestMapping("/login")
    public @ResponseBody
    Result login(@RequestParam("username") String username, @RequestParam("password") String password,
                 ModelAndView modelAndView) {
        Result result = new Result();
        Account account = new Account();
        account.setPassword(password);
        account.setUsername(username);
        account = accountService.getAccountByUsernameAndPassword(account);
        modelAndView.addObject("user", account);
        if (account != null) {
            result.setSuccess(true);
            result.setMsg("ok");
        }
        return result;
    }

    public void setAccountService(AccountService accountService) {
        this.accountService = accountService;
    }

    public AccountService getAccountService() {
        return accountService;
    }
}
