import { get, postData, getAddToken } from '../utils/utils'


const host = 'http://192.168.0.149';
// const host = 'http://forex.pushutech.com'
const ezquant = 'http://www.ezquant.cn'
const market = 'http://real.pushutech.com'



//搜索股票
export function searchStcok(data) {
    return get(host + '/real/wizard', data)
}

//获取股票K线图数据
export function getKline(data) {
    return postData(market + '/quote/internal/kline', data)
}

//获取股票K线图（可控制数量）
export function getCountKline(data) {
    return get(market + '/quote/kline/data', data)
}

//股票K线图最后一根K线数据
export function getLastKline(data) {
    return postData(market + '/quote/internal/lastkline', data)
}


//注册
export function register(data) {
    return get(host + '/register/email', data)
}

//发送激活
export function sendActiveEamil(data) {
    return get(host + '/register/send/active/mail', data)
}
//登录
export function login(data) {
    return get(host + '/login/post', data)
}



//首页
//获取首页列表
export function homeList(data) {
    return get(host + '/real/list', data)
}
//行情数据
export function quoteReal(data) {
    return get(market + '/quote/real', data)
}

//添加自选
export function addOptional(data, token) {
    return getAddToken(host + '/market/favorite/add', data, token)
}
//删除自选
export function deleteOptional(data, token) {
    return getAddToken(host + '/market/favorite/delete', data, token)
}
//自选列表
export function optionalList(data, token) {
    return getAddToken(host + '/market/favorite/list', data, token)
}



//找回密码
export function findPassword(data) {
    return get(ezquant + '/password/update', data)
}

//获取用户信息
export function getUserinfo(data) {
    return postData(ezquant + '/userinfo', data)
}
//获取未读消息
export function getUnreadNum(data) {
    return postData(ezquant + '/broadcast/unread', data)
}

//首页排行榜
export function getRanking(data) {
    return get(ezquant + '/quant/get/ranking', data)
}

//获取验证码
export function getCode(data) {
    return get(ezquant + '/register/authcode', data)
}


//交易室



//查询股票代码的行情
export function getQuote(data) {
    return get(market + '/quote/real', data)
}

//交易及资金数据
export function getBalanceFast(data) {
    return get(ezquant + '/secu/balancefastqry', data)
}

//股票策略最优列表
export function strategyOptimallist(data) {
    return postData(ezquant + '/quant/optimal/strategy', data)
}
//策略买卖点
export function getSellPoint(data) {
    return postData(ezquant + '/quant/optimal/strategy/backprobe', data)
}

//最优策略股票列表
export function optimalStock(data) {
    return postData(ezquant + '/quant/strategy/optimal/stock', data)
}
//托管策略列表
export function trustStrategyStock(data) {
    return postData(ezquant + '/quant/strategy/trade/list', data)
}

//我的股票池
export function myStockPool(data) {
    return postData(ezquant + '/user/core/stock/pool/list', data)
}

//股票池内的股票列表
export function poolStcokList(data) {
    return postData(ezquant + '/user/core/stock/pool', data)
}

export function deletePoolStock(data) {
    return postData(ezquant + '/user/core/stock/pool/deletestock', data)
}
export function addPoolStock(data) {
    return postData(ezquant + '/user/core/stock/pool/addstock', data)
}

//创建股票池
export function createPool(data) {
    return postData(ezquant + '/user/core/stock/pool/create', data)
}

//模拟交易
//当前持仓
export function currentHold(data) {
    return postData(ezquant + '/secu/stockpositionqry', data)
}

//是否节假日
export function isHoliday(data) {
    return get(ezquant + '/quote/holiday', data)
}

//上涨、平盘、下跌家数
export function upDownNumber(data) {
    return get(ezquant + '/quote/marketchange', data)
}
//实时交易列表
export function changereal(data) {
    return get(ezquant + '/quote/changereal', data)
}

//历史委托
export function historyEntrust(data) {
    return postData(ezquant + '/secu/entrusthisqry', data)
}
//当日委托
export function currentEntrust(data) {
    return postData(ezquant + '/secu/entrustqry', data)
}

//当日成交
export function dealCurrent(data) {
    return postData(ezquant + '/secu/businessqry', data)
}

//历史成交
export function dealHistory(data) {
    return postData(ezquant + '/secu/businesshisqry', data)
}

//可撤单列表
export function cancelOrderList(data, token) {
    return postData(ezquant + '/secu/entrustqry?token=' + token, data)
}

//撤单
export function cancelOrder(data, token) {
    return postData(ezquant + '/secu/withdrawenter?token=' + token, data)
}

//委托买入
export function entrustBuy(data, token) {
    return postData(ezquant + '/secu/entrustenter?token=' + token, data)
}


//公司状况
//公司新闻
export function companyNew(data) {
    return postData(ezquant + '/news/company', data)
}
//公司简介
export function companyIntroduction(data) {
    return postData(ezquant + '/news/f10/companyprofile', data)
}
//公司高管
export function companySenior(data) {
    return postData(ezquant + '/news/f10/companyleaderin', data)
}

//公司公告
export function companyNotice(data) {
    return postData(ezquant + '/news/announcement', data)
}
//公司研报
export function companyReport(data) {
    return postData(ezquant + '/news/researchreport', data)
}

//资金流向
export function moneyFlow(data) {
    return postData(ezquant + '/quote/stock/flow', data)
}

//证券交易
export function stockTrade(data) {
    return postData(ezquant + '/news/f10/secuinfo', data)
}

//操盘必读
export function headlines(data) {
    return postData(ezquant + '/news/f10/headlines', data)
}

//分红送转
export function distribution(data) {
    return postData(ezquant + '/news/f10/distribution', data)
}

//分红配股增发
export function distributionEc(data) {
    return postData(ezquant + '/news/ec/distruibution', data)
}


//编辑策略
//函数列表
export function fetchFunctionList(data, token) {
    return getAddToken(host + '/intelli/script/function', data, token)
}

//策略列表
export function fetchStategyList(data, token) {
    return getAddToken(host + '/intelli/script/import/strategy/list', data, token)
}

//策略详情
export function strategyDetail(data, token) {
    return getAddToken(host + '/intelli/script/detail', data, token)
}

//编译策略
export function compileStrategy(data, token) {
    return getAddToken(host + '/intelli/script/compile', data, token)
}

//保存策略
export function saveStrategy(data, token) {
    return getAddToken(host + '/intelli/script/save', data, token)
}

//开始回测
export function backtest(data, token) {
    return getAddToken(host + '/intelli/script/backtest', data, token)
}

//沪深300
export function standardCurve(data) {
    return postData(ezquant + '/quant/yield/curve', data)
}

//回测报告
export function backTestReport(data) {
    return postData(ezquant + '/quant/backtest/report/detail', data)
}

//策略托管及发布
export function deployStrategy(data) {
    return postData(ezquant + '/quant/deploy', data)
}

//我的策略列表
export function myStrategyList(data, token) {
    return getAddToken(host + '/my/strategy/list', data, token)
}

//删除我的策略
export function deleteStrategy(data, token) {
    return getAddToken(host + '/my/strategy/delete', data, token)
}

//发布的策略
export function deployStrategyList(data, token) {
    return getAddToken(host + '/my/strategy/deploy/list', data, token)
}

//发布策略列表-shared
export function shareStrategyList(data, token) {
    return getAddToken(host + '/my/strategy/shared/list', data, token)
}

//删除发布的策略
export function deleteDeploy(data, token) {
    return getAddToken(host + '/my/strategy/deploy/delete', data, token)
}

//暂停发布的策略
export function suspendDeploy(data, token) {
    return getAddToken(host + '/my/strategy/deploy/update', data, token)
}

//托管的策略
export function trustStrategy(data, token) {
    return getAddToken(host + '/intelli/script/run', data, token)
}

//设置交易方式
export function setTradeMethod(data) {
    return postData(ezquant + '/update/trade/flag', data)
}

//删除托管的策略
export function deleteTrust(data, token) {
    return getAddToken(host + '/my/strategy/deploy/delete', data, token)
}

//信号通知方式
export function strategyNotice(data) {
    return postData(ezquant + '/strategy/update/notice', data)
}

//跟单的策略
export function followStrategy(data, token) {
    return getAddToken(host + '/my/strategy/follow/list', data, token)
}

//删除跟单的策略
export function deleteFollowStrategy(data,token) {
    return getAddToken(host + '/strategy/list/follow/delete', data,token)
}
//设置跟单交易方式
export function setFollowTradeMethod(data) {
    return postData(ezquant + '/update/signal/trade/flag', data)
}
//跟单信号通知方式
export function followStrategyNotice(data) {
    return postData(ezquant + '/trade/signal/notice', data)
}

//收藏的策略
export function collectStrategy(data, token) {
    return getAddToken(host + '/my/strategy/collect/list', data, token)
}

//删除收藏策略
export function deleteCollect(data, token) {
    return getAddToken(host + '/strategy/list/collect/delete', data, token)
}

//收藏策略跟单
export function collectFollow(data, token) {
    return getAddToken(host + '/strategy/list/follow', data, token)
}

//获取排行榜数据
export function rankData(data, token) {
    return getAddToken(host + '/strategy/list/ranking', data, token)
}

export function rankDataLatest(data, token) {
    return getAddToken(host + '/strategy/list/latest', data, token)
}


//排行
//排行榜的策略详情
export function strategyDetailData(data, token) {
    return getAddToken(host + '/strategy/list/detailed', data, token)
}

//添加收藏
export function addCollect(data, token) {
    return getAddToken(host + '/strategy/list/collect/add', data, token)
}

//策略详情回测报告
export function strategyDetailReport(data, token) {
    return getAddToken(host + '/my/strategy/backtest/report', data, token)
}

//回测列表
export function backtestList(data) {
    return postData(ezquant + '/quant/backtest/backprobe/list', data)
}

//绩效对比数据
export function strategyCompare(data) {
    return postData(ezquant + '/quant/strategy/capital/curve/contrast', data)
}

//删除回测记录
export function deleteBacktestRecord(data) {
    return postData(ezquant + '/quant/backtest/delete', data)
}

//策略版本列表
export function strategyVersion(data) {
    return postData(ezquant + '/quant/strategy/history/version', data)
}


//搭建策略
//指标列表
export function indicateList(data, token) {
    return getAddToken(host + '/strategy/builder/system', data, token)
}

//编译策略代码
export function createStrategyCode(data, token) {
    return getAddToken(host + '/strategy/builder/create', data, token)
}

//保存创建的策略
export function saveCreateStrategy(data, token) {
    return getAddToken(host + '/strategy/builder/save', data, token)
}


//市场扫描
//市场列表
export function marketList(data) {
    return postData(ezquant + '/strategy/build/basic', data)
}
//所有概念板块
export function conceptBlockAll(data) {
    return postData(ezquant + '/quote/blocksort', data)
}

//市场扫描保存
export function saveMarketScab(data) {
    return postData(ezquant + '/quant/scanning/save', data)
}

//托管扫描策略列表
export function trustScanList(data) {
    return postData(ezquant + '/quant/scanning/strategy/list', data)
}

//单次扫描列表
export function singleScanList(data) {
    return postData(ezquant + '/quant/single/scan/list', data)
}

//策略扫描详情
export function strategyScanDetail(data) {
    return postData(ezquant + '/quant/scanning/detail', data)
}

//删除扫描的策略
export function deleteScanStrategy(data) {
    return postData(ezquant + '/quant/scanning/delete', data)
}

//单次扫描
export function singleScan(data) {
    return postData(ezquant + '/quant/single/scanning', data)
}
//托管策略扫描列表
export function trustScan(data) {
    return postData(ezquant + '/quant/scanning', data)
}