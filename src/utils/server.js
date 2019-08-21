/**
 * url接口
 */

const Service ={
    test: 'https://www.bitstation.co',
    host:'https://www.bitstation.co',
    realCandle:'/real/candle',
    realTickerSingle:'/real/ticker',//最新一条的行情数据
    ticker:'/real/list',  // 最新的一条数据
    messageList:'/message/list',  // MessageList
    register:'/user/register/email',//注册
    login:'/user/login/post',//登录
    activeEmail:'/user/send/active/mail',//激活邮箱
    editPassword:'/updatepassword',//修改密码
    editName:'/updatenickname',//修改名字
    getUser:'/getuser',//通过id获取用户信息
    realSymbols:'/real/symbols',//改成带'/'的代码
    addAccount:'/user/account/save',//新增交易室账号
    accountList:'/user/account/list',//账号列表
    editAccount:'/updateaccount',//修改账号
    deleteAccount:'/deleteaccount',//删除交易账号
    realWizard:'/real/wizard',//搜索股票
    realPrecise:'/real/precise',//保留几位小数
    realQuantityIncrement:'/real/quantity/increment',//判断交易时候的数量是否符合要求
    marketList:'/market/list',//默认市场列表
    marketFavoriteList:'/market/favorite/list',//自选股列表
    marketFavoriteAdd:'/market/favorite/add',//添加自选
    marketFavoriteDelete:'/market/favorite/delete',//删除自选
    tradeCreateOrder:'/trade/create/order',//交易下单
    tradeOrder:'/trade/order',//订单列表
    tradeOrderSymbol:'/trade/order/symbol',//订单列表根据symbol获取
    tradeCancelOrder:'/trade/cancel/order',//撤单
    tradeCancelAllOrder:'/trade/cancel/allorder',//撤掉所有的单
    tradeBalance:'/trade/balance',//持仓
    tradeHistory:'/trade/history',//历史记录
    tradeHistorySymbol:'/trade/history/symbol',//历史记录根据symbol查询
    chatRoomList:'/chat/room/list',//获取聊天列表
    chatRoomUser:'/chat/room/user',//基金经理人员
    chatList:'/chat/list',//获取聊天列表
    chatAdd:'/chat/add',//发送消息
    realScore:'/real/score',//评分
    systemPolicy:'/strategy/builder/system',   //系统策略
    createCode:'/strategy/builder/create',   //生成策略代码
    saveBuilderStrategy:'/strategy/builder/save',   //保存策略代码
    strategydetail:'/strategy/builder/detail',    //策略详情
    compile: '/intelli/script/compile',
    getFncList: '/intelli/script/function', // 获取函数列表
	mystrategy: '/my/strategy/list',    //我的策略
    deploystrategy: '/my/strategy/deploy/list',    //托管的策略
    updatedeploy: '/my/strategy/deploy/update',    //托管策略更新
    deletestrategy: '/my/strategy/delete',    //删除策略
    deleterunstrategy: '/my/strategy/deploy/delete',    //删除托管策略
    sharedstrategy:'/my/strategy/shared/list',      //发布策略列表
    sharedUser:'/my/strategy/shared/user',  //发布跟单策略列表
    backtestlist:'/my/strategy/backtest/list',     //策略回测列表
    deletebacktest:'/my/strategy/backtest/delete',  //删除回测
    saveIntelliStrategy: '/intelli/script/save', //保存编译后的策略
    getStrategyList: '/intelli/script/import/strategy/list', //获取所有策略
    backtest: '/intelli/script/backtest', //策略回测
    runStrategy: '/intelli/script/run', // 托管策略
    scanList:'/market/scan/list',  //扫描列表
    scanDetail:'/market/scan/detail',    //扫描详情
    hotscanList:'/market/scan/hot/strategy',  //热门扫描列表
    updateScanstatus:'/market/scan/status',  //修改扫描状态
    marketscan:'/market/scan',          //扫描
    deleteScan:'/market/scan/delete',  //刪除扫描
    saveScan:'/market/scan/save',  //保存扫描信息
    loadStrategy: '/intelli/script/detail', //加载策略
    saveReport: '/intelli/script/backtest/save', //保存报表
    strategyRanking:'/strategy/list/ranking',    //收益排行榜
    strategyLatest:'/strategy/list/latest',  //最新排行榜
    getBacktestReport: '/my/strategy/backtest/report', //获取回测报告
    addCollect: '/strategy/list/collect/add', //收藏策略
    removeCollect: '/strategy/list/collect/delete', //取消收藏策略
    getStrategyDetail: '/strategy/list/detailed', //获取策略详情
    strategyContrast:'/my/strategy/contrast/curve',    //绩效对比
    followOrder: '/strategy/list/follow', //确认跟单
    followList:'/my/strategy/follow/list',   //跟单列表
    deleteFollow:'/strategy/list/follow/delete',   //删除策略跟单
    collectList:'/my/strategy/collect/list',   //收藏列表
    stratgyOptimal:'/my/strategy/optimal',//最优策略
    strategyOptimalShow:'/my/strategy/optimal/show',//最优策略买卖点
};

export default Service;
