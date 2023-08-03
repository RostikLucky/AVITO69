//////////////////////////
//                      //
//       AVITO69        //
//                      //
//////////////////////////
/// npm init
const fetch = require('node-fetch'); /// npm i --save node-fetch@2
const sqlite3 = require('sqlite3').verbose(); /// npm i --save-dev sqlite3
var TelegramBot = require('node-telegram-bot-api'); /// npm i --save node-telegram-bot-api
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk'); /// npm i --save @qiwi/bill-payments-node-js-sdk

//////////////////////////
//                      //
//     БАЗА ДАННЫХ      //
//                      //
//////////////////////////
function createDatabase() {
  db = new sqlite3.Database('./AVITO69.db', (err) => {
    db.exec(`
      create table usersInfo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER,
        firstName TEXT,
        userName TEXT,
        dateRegistration TEXT,
        balance FLOAT,
        balanceDeposits TEXT,
        balanceCashout TEXT,
        tempBalanceDeposit TEXT,
        lastAction TEXT,
        earningType TEXT,
        promotionsCount INTEGER,
        earningTaskCount INTEGER,
        referalsCount INTEGER,
        tempPromotion TEXT,
        tempPromotionCount INTEGER,
        myReferal INTEGER,
        referalsEarning FLOAT,
        adminEarning FLOAT
      );

      create table promotionsInfo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER,
        userNamePromotion TEXT,
        promotionType TEXT,
        promotionCategory TEXT,
        datePromotion TEXT,
        title TEXT,
        nowEarning TEXT,
        url TEXT,
        count INTEGER,
        startCount INTEGER,
        nowCount INTEGER,
        promotionPrice FLOAT,
        executorPrice FLOAT,
        referalPrice FLOAT,
        referalIDPay INTEGER,
        usersComplited TEXT,
        status TEXT
      );
    `)
  })
}

//////////////////////////
//                      //
//      ПЕРЕМЕННЫЕ      //
//                      //
//////////////////////////
const publicKey = 'publicKey';
const SECRET_KEY = 'SECRET_KEY';
const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);
promotions = [{'info': {'text': '💥 Подписчики на профиль - 2₽', 'type': 'followers', 'title': 'profileFollowers', 'executorTitle': 'Подпишитесь на профиль (?)', 'callback_data': 'profileFollowers*profileURL', 'promotionCountText': 'подписчиков от 1 до 50!', 'minMaxCount': [1, 50], 'price': 2, 'executorPrice': 1, 'referalPrice': 0.15}}];
promotions_text = "";
promotions_buttons = [];
for (var i = 0; i < promotions.length; i++) {promotions_text += '\n' + promotions[i].info.text};
for (var i = 0; i < promotions.length; i++) {promotions_buttons.push([{text: promotions[i].info.text, callback_data: promotions[i].info.callback_data}])};
earning_types = [[{text: '👥 Подписки на профиль', callback_data: 'startEarning*followers'}]];
message_text = {
  /// Главное меню
  'mainWindow': {'text': `🏠 \`AVITO69\` - это сервис по продвижению и заработку на сайте avito!\n*Наши услуги по продвижению:*${promotions_text}`, 'img': 'https://tg.goh.su/AVITO69/mainWindow.jpg', 
    'buttons': [[{text: '📑 Сделать заказ', callback_data: 'createPromotion'}, {text: '🗂 Мои заказы', callback_data: 'myPromotions'}], 
                [{text: '💰 Заработать', callback_data: 'earningType'}], 
                [{text: '👤 Моя информация', callback_data: 'myInformation'}]
               ]},
  /// Сделать заказ
  'createPromotion': {'text': '📑 Выберите услугу', 'img': 'https://tg.goh.su/AVITO69/createPromotion.jpg', 'buttons': promotions_buttons.concat([[{text: '🏠 Главное меню', callback_data: 'mainWindow'}]])},
  'profileURL': {'text': '🔗 Отправьте ссылку на ваш профиль *Avito*', 'img': 'https://tg.goh.su/AVITO69/createPromotion.jpg', 'buttons': [[{text: '🔗 Где найти ссылку на профиль', url: 'https://telegra.ph/Kak-najti-ssylku-na-profil-Avito-01-10'}], [{text: '❎ Отменить заказ', callback_data: 'cancelPromotion'}]]},
  'profileURLerror': {'text': '🔗 Вы ошиблись при вводе ссылки на ваш профиль *Avito!*\n(?)', 'img': 'https://tg.goh.su/AVITO69/createPromotion.jpg', 'buttons': [[{text: '🔗 Где найти ссылку на профиль', url: 'https://telegra.ph/Kak-najti-ssylku-na-profil-Avito-01-10'}], [{text: '❎ Отменить заказ', callback_data: 'cancelPromotion'}]]},
  'promotionCount': {'text': '🖋 *Отправьте боту количество* (?)', 'img': 'https://tg.goh.su/AVITO69/createPromotion.jpg', 'buttons': [[{text: '❎ Отменить заказ', callback_data: 'cancelPromotion'}]]},
  'promotionCountError': {'text': '🖋 Вы ошиблись *при вводе количества!*\nПопробуйте еще раз', 'img': 'https://tg.goh.su/AVITO69/createPromotion.jpg', 'buttons': [[{text: '❎ Отменить заказ', callback_data: 'cancelPromotion'}]]},
  'promotionConfirm': {'text': '🗂 *Подтвердите заказ*\n- (?)\n- Ссылка: (?)\n- Количество: *(?)*\n- Стоимость: *(?)*₽\nВаш баланс: *(?)*₽', 'img': 'https://tg.goh.su/AVITO69/createPromotion.jpg', 'buttons': [[{text: '❎ Отменить заказ', callback_data: 'cancelPromotion'}]]},
  'depositBalance': {'text': '💰 *Пополнение баланса!*\n(?)', 'img': 'https://tg.goh.su/AVITO69/depositBalance.jpg', 'buttons': [[{text: '🏠 Главное меню', callback_data: 'cancelPromotion'}]]},
  'depositBalanceError': {'text': '💰 *Произошла ошибка!*\n(?)', 'img': 'https://tg.goh.su/AVITO69/depositBalance.jpg', 'buttons': [[{text: '🏠 Главное меню', callback_data: 'cancelPromotion'}]]},
  'startPromotionError': {'text': '🗂 *Произошла ошибка!*\n(?)', 'img': 'https://tg.goh.su/AVITO69/depositBalance.jpg', 'buttons': [[{text: '🏠 Главное меню', callback_data: 'cancelPromotion'}]]},
  /// Мои заказы
  'myPromotions': {'text': '🗂 *Ваши заказы*\nВсего заказов: *(?)*\nAктивных заказов: *(?)*', 'img': 'https://tg.goh.su/AVITO69/myPromotions.jpg', 'buttons': [[{text: '🏠 Главное меню', callback_data: 'mainWindow'}]]},
  'myPromotionInfo': {'text': '🗂 *Ваш заказ* `#(?)`\n- (?)\n- Ссылка: (?)\n- Выполнено: *(?)*\n- Статус: *(?)*', 'img': 'https://tg.goh.su/AVITO69/myPromotions.jpg', 'buttons': [[{text: '🗂 Мои заказы', callback_data: 'myPromotions'}]]},
  /// Заработок
  'earningType': {'text': '💰 *Выберите категорию заработка*', 'img': 'https://tg.goh.su/AVITO69/earningType.jpg', 'buttons': earning_types.concat([[{text: '🏠 Главное меню', callback_data: 'mainWindow'}]])},
  'startEarning': {'text': '💰 (?)\nВаш баланс: (?)₽\nВы получите: (?)₽', 'img': 'https://tg.goh.su/AVITO69/earningType.jpg', 'buttons': [[{text: '🏠 Главное меню', callback_data: 'mainWindow'}]]},
  'earningError': {'text': '💰 (?)', 'img': 'https://tg.goh.su/AVITO69/earningType.jpg', 'buttons': [[{text: '📑 Поиск заданий', callback_data: 'startEarning'}], [{text: '🏠 Главное меню', callback_data: 'mainWindow'}]]},
  /// Информация о пользователе
  'myInformation': {'text': '👤 *Ваша информация*\nБаланс: *(?)₽*\nСоздано заказов: *(?)*\nВыполнено заданий: *(?)*\nКоличество рефералов: *(?)*\nЗаработок с рефералов: *(?)₽*\nВаша реферальная ссылка: `(?)`', 'img': 'https://tg.goh.su/AVITO69/myInformation.jpg', 'buttons': [[{text: '💰 Вывод средств', callback_data: 'cashout*qiwi'}], [{text: '🏠 Главное меню', callback_data: 'mainWindow'}]]},
  'cashout': {'text': '💰 *Вывод средств*\n(?)', 'img': 'https://tg.goh.su/AVITO69/cashout.jpg', 'buttons': [[{text: '🏠 Главное меню', callback_data: 'mainWindow'}]]}
}

//////////////////////////
//                      //
//  ВЫПОЛНЕНИЕ ЗАПРОСА  //
//                      //
//////////////////////////
async function fetch_request(url, method, headers, body, type, useragent) {
  function jsonConcat(o1, o2) {
    for (var key in o2) o1[key] = o2[key];
    return o1;
  }
  value = {"status": "error", "data": "invalid_request"};
  fetch_data = {
    method: method,
    headers: jsonConcat({
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5,tr;q=0.4',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent': useragent
    }, headers)
  }
  if (method == "POST") fetch_data["body"] = body;
  await fetch(url, fetch_data).then(async function(data) {
    if (type == "text") return data.text();
    else if (type == "json") return data.json();
  }).then(async function(data) {
    value = {"status": "success", "data": data};
  }).catch(async function(data){
    data = data.toString();
    if (data.indexOf("Failed to fetch") != -1) value = {"status": "error", "data": "invalid_url"};
    else if (data.indexOf("SyntaxError") != -1) value = {"status": "error", "data": "invalid_request"};
    else value = {"status": "error", "data": data};
  });
  return value;
}

async function getUser(url) {
  headers = {'cookie': 'cookie AVITO'};
  request = await fetch_request(`https://m.avito.ru/api/2/user/${url}/extended-profile?key=af0deccbgcgidddjgnvljitntccdduijhdinfgjgfjir`, "GET", headers, "{}", "json", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36").then(async function(request){return request});
  if (request.status == "success") {
    data = request.data;
    if (data.status == "ok") {
      if (data.result.widgets[0].value.subscribeInfo !== undefined) {
        if (data.result.widgets[0].value.subscribeInfo.subscribers !== undefined) {
          return [data.result.data.username, data.result.widgets[0].value.subscribeInfo.subscribers.title]
        } else return "Количество подписчиков не найдено!";
      } else return "Количество подписчиков не найдено!";
    } else if (data.status == "not-found") return "Пользователь не найден!";
    else if (data.status == "placeholder") return "Произошла ошибка `placeholder`!";
    else if (data.status == "forbidden") return "Произошла ошибка при `выполнении запроса`!";
    else return `Произошла ошибка ${JSON.stringify(data)}!`;
  } else return `Произошла ошибка ${request.status}!`;
}

//////////////////////////
//                      //
// ОБРАБОТКА СООБЩЕНИЙ  //
//                      //
//////////////////////////
async function sendMessage(chatId, msgId, action, data='') {
  textReplace = '';
  addButtons = [];
	if (action.indexOf('*') != -1) {
    //////////////////////////
    //                      //
    // ОБРАБОТКА ВВОДА ДАН. //
    //                      //
    //////////////////////////
    if (data == '') {
      if (action.indexOf('*depositBalance') != -1) {
        /// Пополнение баланса
        actions = 'depositBalance';
        textReplace = ['Пополнение минимум от 15₽!\nОтправьте боту сумму'];
      } else if (action.indexOf('*checkDepositBalance') != -1) {
        /// Проверить пополнение баланса
        row = await db_all(`SELECT balance, tempBalanceDeposit, balanceDeposits FROM usersInfo WHERE userID = ${chatId}`).then(function(row) {return row});
        data = await qiwiApi.getBillInfo(row[0].tempBalanceDeposit.toString()).then(function(data) {return data}).catch(function(error) {return 'error'})
        if (data != 'error') {
          if (data.status.value == "PAID") { 
            if (data.amount.currency == "RUB") {
              await db.run("UPDATE usersInfo SET balance=?, balanceDeposits=?, tempBalanceDeposit=? WHERE userID=?", [row[0].balance + Number(data.amount.value), `${row[0].balanceDeposits}[${Number(data.amount.value)} - ${new Date().toString()}] `, '', chatId], function(err,rows){});
              actions = action = action.split('*')[0];     
            } else {
              actions = action = 'depositBalanceError';
              textReplace = ['Счет пополнен не в рублях!\nОбратитесь к @RostikLucky за помощью'];
            }
          } else { 
            actions = action = 'depositBalanceError';
            textReplace = ['Пополнение не найдено, попробуйте проверить еще раз!'];
            addButtons = [[{text: '🔄 Проверить пополнение', callback_data: action.split('*')[0]+'*checkDepositBalance'}]];
          }
        } else {
          actions = action = 'depositBalanceError';
          textReplace = ['Пополнение не найдено, попробуйте проверить еще раз!'];
          addButtons = [[{text: '🔄 Проверить пополнение', callback_data: action.split('*')[0]+'*checkDepositBalance'}]];
        }
      } else if (action.indexOf('myPromotionInfo*') != -1) {
        /// Посмотреть информацию о заказе 
        actions = 'myPromotionInfo';
        row = await db_all(`SELECT promotionType, userNamePromotion, url, nowCount, startCount, count, status FROM promotionsInfo WHERE userID = ${chatId} and id = ${action.split('*')[1]}`).then(function(row) {return row});
        textReplace = [action.split('*')[1], row[0].promotionType, `[${row[0].userNamePromotion}](${row[0].url})`, `${row[0].nowCount - row[0].startCount} из ${row[0].count}`, row[0].status];
        if (row[0].status == 'активно') addButtons = [[{text: '🔹 Остановить услугу', callback_data: `myPromotionStop*${action.split('*')[1]}`}]];
      } else if (action.indexOf('myPromotionStop*') != -1) {
        /// Остановить услугу
        actions = `mainWindow`;
        row = await db_all(`SELECT count, startCount, nowCount, promotionPrice FROM promotionsInfo WHERE id = ${action.split('*')[1]}`).then(function(row) {return row});
        balance = (row[0].count - (row[0].nowCount - row[0].startCount)) * row[0].promotionPrice;
        row = await db_all(`SELECT balance FROM usersInfo WHERE userID = ${chatId}`).then(function(row) {return row});
        await db.run("UPDATE usersInfo SET balance=? WHERE userID=?", [row[0].balance + balance, chatId],function(err,rows){});
        await db.run("UPDATE promotionsInfo SET status=? WHERE userID=? and id=?", ['остановлено', chatId, action.split('*')[1]],function(err,rows){});
      } else if (action.indexOf('startEarning*') != -1) {
        /// Выбор категории заработка
        await db.run("UPDATE usersInfo SET earningType=? WHERE userID=?", [action.split('*')[1], chatId],function(err,rows){});
        actions = action = 'startEarning';
      } else if (action.indexOf('checkTask*') != -1) {
        /// Проверить задание
        taskId = action.split('*')[1];
        row = await db_all(`SELECT url, nowEarning, nowCount, startCount, count, status, promotionPrice, usersComplited, referalIDPay, referalPrice, executorPrice FROM promotionsInfo WHERE id=${taskId}`).then(function(row) {return row});
        await db.run("UPDATE promotionsInfo SET nowEarning=? WHERE id=?", ['', taskId],function(err,rows){});
        if (Number(row[0].nowEarning.split('[')[0]) == chatId) {
          if (row[0].status == 'активно') {
            user_info = await getUser(row[0].url.split('/')[row[0].url.split('/').length - 2]);
            nowCount = Number(user_info[1]);
            if (user_info.length == 2) {
              if (nowCount > row[0].nowCount) {
                await db.run("UPDATE promotionsInfo SET nowCount=? WHERE id=?", [nowCount, taskId],function(err,rows){});
                /// Продвижение выполнено полностью
                if (nowCount - row[0].startCount >= row[0].count) {await db.run("UPDATE promotionsInfo SET status=? WHERE id=?", ['выполнено', taskId],function(err,rows){})}
                /// Зачислить средства
                rowUser = await db_all(`SELECT balance, myReferal, earningTaskCount FROM usersInfo WHERE userID=${chatId}`).then(function(row) {return row});
                await db.run("UPDATE usersInfo SET balance=?, earningTaskCount=? WHERE userID=?", [(rowUser[0].balance + row[0].executorPrice).toFixed(2), rowUser[0].earningTaskCount + 1, chatId],function(err,rows){});
                adminEarning = row[0].promotionPrice - row[0].executorPrice;
                /// Оплата рефералу
                if (rowUser[0].myReferal != "") {
                  rowUserTemp = await db_all(`SELECT balance, referalsEarning FROM usersInfo WHERE userID=${rowUser[0].myReferal}`).then(function(row) {return row});
                  await db.run("UPDATE usersInfo SET balance=?, referalsEarning=? WHERE userID=?", [(rowUserTemp[0].balance + row[0].referalPrice).toFixed(2), (rowUserTemp[0].referalsEarning + row[0].referalPrice).toFixed(2), rowUser[0].myReferal],function(err,rows){});
                  adminEarning = adminEarning - row[0].referalPrice;
                }
                if (row[0].referalIDPay != "") {
                  rowUserTemp = await db_all(`SELECT balance, referalsEarning FROM usersInfo WHERE userID=${row[0].referalIDPay}`).then(function(row) {return row});
                  await db.run("UPDATE usersInfo SET balance=?, referalsEarning=? WHERE userID=?", [(rowUserTemp[0].balance + row[0].referalPrice).toFixed(2), (rowUserTemp[0].referalsEarning + row[0].referalPrice).toFixed(2), row[0].referalIDPay],function(err,rows){});
                  adminEarning = adminEarning - row[0].referalPrice;
                }
                rowUserTemp = await db_all(`SELECT balance, adminEarning FROM usersInfo WHERE userID=313997284`).then(function(row) {return row});
                await db.run("UPDATE usersInfo SET balance=?, adminEarning=? WHERE userID=?", [(rowUserTemp[0].balance + adminEarning).toFixed(2), (rowUserTemp[0].adminEarning + adminEarning).toFixed(2), 313997284],function(err,rows){});
                await db.run("UPDATE promotionsInfo SET usersComplited=? WHERE id=?", [row[0].usersComplited + `${chatId}[выполнил] `, taskId],function(err,rows){});
                actions = action = 'startEarning';
              } else {
                /// Не подписался
                await db.run("UPDATE promotionsInfo SET usersComplited=? WHERE id=?", [row[0].usersComplited + `${chatId}[не выполнил] `, taskId],function(err,rows){});
                actions = 'earningError';
                textReplace = ['Вы не выполнили задание!'];
              }
            } else {
              /// Ошибка при проверке
              await db.run("UPDATE promotionsInfo SET usersComplited=? WHERE id=?", [row[0].usersComplited + `${chatId}[ошибка при проверке] `, taskId],function(err,rows){});
              actions = 'earningError';
              textReplace = ['Произошла ошибка при проверке задания!'];
            }
          } else {
            actions = 'earningError';
            textReplace = ['Произошла ошибка, задание приостановлено!'];
          }
        } else {
          actions = 'earningError';
          textReplace = ['Прошло более 40 секунд! Выполняйте задания быстрее'];
          await db.run("UPDATE promotionsInfo SET usersComplited=? WHERE id=?", [row[0].usersComplited + `${chatId}[40 сек] `, taskId],function(err,rows){});
        }
      } else if (action.indexOf('nextTask*') != -1) {
        /// Пропустить задание
        taskId = action.split('*')[1];
        await db.run("UPDATE promotionsInfo SET nowEarning=? WHERE id=?", ['', taskId],function(err,rows){});
        row = await db_all(`SELECT usersComplited FROM promotionsInfo WHERE id=${taskId}`).then(function(row) {return row});
        await db.run("UPDATE promotionsInfo SET usersComplited=? WHERE id=?", [row[0].usersComplited + `${chatId}[пропустил] `, taskId],function(err,rows){});
        actions = action = 'startEarning';
      } else if (action.indexOf('cashout*') != -1) {
        /// Ввод КИВИ кошелька для вывода
        temp_action = action.split("*")[1];
        if (temp_action == 'qiwi') textReplace = ['Введите номер QIWI кошелька для вывода!'];
        actions = 'cashout';
      } else actions = action.split("*")[1];
    } else if (action.indexOf('*profileURL') != -1) {
      /// Обработка ссылки на профиль
      profileURL = '';
      if (data.indexOf("avito.ru/user/") != -1) profileURL = (data.split("avito.ru/user/")[1].indexOf("/") != -1) ? data.split("avito.ru/user/")[1].split("/")[0] : data.split("avito.ru/user/")[1];
      if (profileURL == '') {
        actions = 'profileURLerror';
        textReplace = ['Попробуйте еще раз'];
      } else {
        /// Проверка профиля
        user_info = await getUser(profileURL);
        if (user_info.length == 2) {
          await db.run("UPDATE usersInfo SET tempPromotion=? WHERE userID=?", [`${action.split('*')[0]}*https://avito.ru/user/${profileURL}/profile*${user_info[0]}*${user_info[1]}`, chatId],function(err,rows){});
          actions = 'promotionCount';
          action = `${action.split('*')[0]}*promotionCount`;
          for (var i = 0; i < promotions.length; i++) {if (promotions[i].info.title == action.split('*')[0]) textReplace = [promotions[i].info.promotionCountText]}
        } else {
          actions = 'profileURLerror';
          textReplace = [user_info];
        }
      }
    } else if (action.indexOf('*promotionCount') != -1) {
      /// Выбор количества для продвижения
      data = Number(data);
      for (var i = 0; i < promotions.length; i++) {if (promotions[i].info.title == action.split('*')[0]) min_max = promotions[i].info.minMaxCount}
      if (!isNaN(data) && data >= min_max[0] && data <= min_max[1]) {
        actions = action = 'promotionConfirm';
        await db.run("UPDATE usersInfo SET tempPromotionCount=? WHERE userID=?", [data, chatId], function(err,rows){});
      } else actions = 'promotionCountError';
    } else if (action.indexOf('*depositBalance') != -1) {
      /// Подтвердить пополнение баланса
      data = Number(data);
      if (!isNaN(data) && data >= 15 && data <= 500) {
        data = Math.floor(data);
        actions = 'depositBalance';
        const params = {
          publicKey,
          amount: data,
          billId: qiwiApi.generateId(),
          comment: `Пополнение бота AVITO69 на ${data} рублей`,
          currency: "RUB",
          successUrl: `https://t.me/AVITO69_bot?start=checkDepositBalance`
        };
        const link = await qiwiApi.createBill(params.billId, params).then(function(val){return val}).catch(function(err){console.log(err)});
        if (link !== undefined) {
          await db.run("UPDATE usersInfo SET tempBalanceDeposit=? WHERE userID=?", [params.billId, chatId], function(err,rows){});
          textReplace = [`Пополнить баланс на ${data}₽`];
          addButtons = [[{text: '🥝 Пополнение через QIWI', url: link.payUrl}], [{text: '🔄 Проверить пополнение', callback_data: 'promotionConfirm*checkDepositBalance'}]];
          action = 'promotionConfirm*checkDepositBalance';
        } else {
          textReplace = [`Произошла ошибка, повторите еще раз!`];
          addButtons = [[{text: '🔄 Повторить пополнение', callback_data: 'promotionConfirm*depositBalance'}]];
        }
      } else {
        actions = 'depositBalance';
        textReplace = ['Пополнение минимум от 15₽!'];
      }
    } else if (action.indexOf('*qiwi') != -1) {
      /// Проверить номер КИВИ
      data = data.replaceAll('+', '');
      data = Number(data);
      if (!isNaN(data) && data.toString().length >= 10 && data.toString().length <= 12) {
        row = await db_all(`SELECT balance, balanceCashout FROM usersInfo WHERE userID=${chatId}`).then(function(row) {return row});
        if (row[0].balance >= 15) {
          await db.run("UPDATE usersInfo SET balance=?, balanceCashout=? WHERE userID=?", [0, `${data}[Ожидает выплаты][${new Date().toString()}] `, chatId],function(err,rows){});
          textReplace = [`Вы успешно поставили на вывод ${row[0].balance}₽`];
        } else textReplace = ['Вывод минимум от 15₽!'];
      } else textReplace = ['Вы ошиблись при вводе номера! Попробуйте еще раз'];
      actions = 'cashout';
    }
    
    //////////////////////////
    //                      //
    //  ОБРАБОТКА ДЕЙСТВИЙ  //
    //                      //
    //////////////////////////
    if (action == 'promotionConfirm') {
      /// Подтвердить заказ
      await db_all(`SELECT tempPromotion, tempPromotionCount, balance FROM usersInfo WHERE userID = ${chatId}`).then(function(row) {
        for (var i = 0; i < promotions.length; i++) {
          if (promotions[i].info.title == row[0].tempPromotion.split('*')[0]) {
            promotionName = promotions[i].info.text;
            promotionPrice = promotions[i].info.price;
          }
        }
        textReplace = [promotionName, `[${row[0].tempPromotion.split('*')[2]}](${row[0].tempPromotion.split('*')[1]})`, row[0].tempPromotionCount, promotionPrice * row[0].tempPromotionCount, row[0].balance];
        if (promotionPrice * row[0].tempPromotionCount <= row[0].balance) addButtons = [[{text: '👍 Подтвердить заказ', callback_data: 'startPromotion'}]];
        else addButtons = [[{text: '💰 Пополнить баланс', callback_data: 'promotionConfirm*depositBalance'}]];
      })
    }
	} else {
    actions = action;
    //////////////////////////
    //                      //
    //   ОБРАБОТКА КНОПОК   //
    //                      //
    //////////////////////////
    /// Отменить заказ на продвижение
    if (action == 'cancelPromotion') {
      await db.run("UPDATE usersInfo SET tempPromotion=?, tempPromotionCount=? WHERE userID=?", ['', '', chatId],function(err,rows){});
      actions = action = 'mainWindow';
    } 

    /// Запустить продвижение
    if (action == 'startPromotion') {
      row = await db_all(`SELECT tempPromotion, tempPromotionCount, balance, myReferal, promotionsCount FROM usersInfo WHERE userID = ${chatId}`).then(function(row) {return row});
      for (var i = 0; i < promotions.length; i++) {
        if (promotions[i].info.title == row[0].tempPromotion.split('*')[0]) {
          promotionPrice = promotions[i].info.price;
          executorPrice = promotions[i].info.executorPrice;
          executorTitle = promotions[i].info.executorTitle;
          referalPrice = promotions[i].info.referalPrice;
          promotionType = promotions[i].info.text;
          categoryType = promotions[i].info.type;
        }
      }
      if (promotionPrice * row[0].tempPromotionCount <= row[0].balance) {
        rowInfo = await db_all(`SELECT id FROM promotionsInfo WHERE url = '${row[0].tempPromotion.split("*")[1]}' and status='активно'`).then(function(row) {return row});
        if (rowInfo.length == 0) {
          await db.run(`INSERT INTO promotionsInfo (userID, datePromotion, title, url, count, startCount, nowCount, promotionPrice, executorPrice, referalPrice, referalIDPay, usersComplited, status, userNamePromotion, promotionType, promotionCategory, nowEarning) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [chatId, new Date().toString(), executorTitle.replace('(?)', row[0].tempPromotion.split("*")[2]), row[0].tempPromotion.split("*")[1], row[0].tempPromotionCount, row[0].tempPromotion.split("*")[3], row[0].tempPromotion.split("*")[3], promotionPrice, executorPrice, referalPrice, row[0].myReferal, `${chatId}[создал] `, 'активно', row[0].tempPromotion.split("*")[2], promotionType, categoryType, ''],function(err,rows){});
          await db.run("UPDATE usersInfo SET tempPromotion=?, tempPromotionCount=?, promotionsCount=?, balance=? WHERE userID=?", ['', '', row[0].promotionsCount + 1, row[0].balance - (promotionPrice * row[0].tempPromotionCount), chatId],function(err,rows){});
          actions = action = 'myPromotions';
        } else {
          await db.run("UPDATE usersInfo SET tempPromotion=?, tempPromotionCount=? WHERE userID=?", ['', '', chatId],function(err,rows){});
          actions = action = 'startPromotionError';
          textReplace = ['*Данный профиль уже находится в продвижении*'];
        }
      } else {
        await db.run("UPDATE usersInfo SET tempPromotion=?, tempPromotionCount=? WHERE userID=?", ['', '', chatId],function(err,rows){});
        actions = action = 'startPromotionError';
        textReplace = ['*У вас недостаточно средств*'];
      }
    }

    /// Посмотреть мои заказы
    if (action == 'myPromotions') {
      row = await db_all(`SELECT id, status FROM promotionsInfo WHERE userID = ${chatId}`).then(function(row) {return row})
      promotionsActive = [];
      promotionsStop = [];
      for (var i = 0; i < row.length; i++) {
        if (row[i].status == 'активно') promotionsActive.push([{text: `🔸 Заказ #${row[i].id}`, callback_data: `myPromotionInfo*${row[i].id}`}]);
        else promotionsStop.push([{text: `🔹 Заказ #${row[i].id}`, callback_data: `myPromotionInfo*${row[i].id}`}])
      }
      textReplace = [promotionsActive.length + promotionsStop.length, promotionsActive.length];
      addButtons = promotionsActive.concat(promotionsStop);
    } 

    /// Посмотреть мою информацию
    if (action == 'myInformation') {
      row = await db_all(`SELECT balance, promotionsCount, earningTaskCount, referalsEarning, referalsCount FROM usersInfo WHERE userID = ${chatId}`).then(function(row) {return row})
      textReplace = [row[0].balance, row[0].promotionsCount, row[0].earningTaskCount, row[0].referalsCount, row[0].referalsEarning, `@AVITO69_bot?start=${chatId}`];
    }
  }

  /// Получить задание
  if (action == 'startEarning') {
    rowUser = await db_all(`SELECT earningType, balance FROM usersInfo WHERE userID = ${chatId}`).then(function(row) {return row});
    row = await db_all(`SELECT id, title, url, executorPrice, nowEarning, nowCount, usersComplited FROM promotionsInfo WHERE instr(\`usersComplited\`, '${chatId}[') = 0 and status = 'активно' and promotionCategory = '${rowUser[0].earningType}'`).then(function(row) {return row});
    taskId = null;
    for (var i = 0; i < row.length; i++) {
      if (row[i].nowEarning == "") {
        taskId = i;
        break
      } else {
        if (new Date(row[i].nowEarning.split('[')[1].split(']')[0]).getTime() + 40000 <= new Date().getTime()) {
          taskId = i;
          break
        }
      }
    }
    if (row.length > 0 && taskId == null) {
      actions = 'earningError';
      textReplace = ['Доступные задания есть, но их сейчас выполняют пользователи. Попробуйте позже!'];
    } else {
      if (taskId == null) {
        actions = 'earningError';
        textReplace = ['Доступных заданий нет. Попробуйте позже!'];
      } else {
        user_info = await getUser(row[taskId].url.split('/')[row[taskId].url.split('/').length - 2]);
        if (user_info.length == 2) {
          await db.run("UPDATE promotionsInfo SET nowEarning=?, nowCount=? WHERE id=?", [`${chatId}[${new Date().toString()}]`, user_info[1], row[taskId].id],function(err,rows){});
          textReplace = [row[taskId].title, rowUser[0].balance, row[taskId].executorPrice];
          addButtons = [[{text: '💼 Выполнить задание', url: row[taskId].url}], [{text: '🗳 Проверить задание', callback_data: `checkTask*${row[taskId].id}`}], [{text: '🚫 Пропустить задание', callback_data: `nextTask*${row[taskId].id}`}]];
        } else {
          await db.run("UPDATE promotionsInfo SET usersComplited=? WHERE id=?", [row[taskId].usersComplited + `${chatId}[ошибка при поиске] `, row[taskId].id],function(err,rows){});
          actions = 'earningError';
          textReplace = ['Произошла ошибка. Возьмите другое задание!'];
        }
      }
    }
  }

	/// Отправить сообщение
  if (message_text[actions].img !== undefined) {
  	telegramBot.sendPhoto(chatId, message_text[actions].img, {
  		caption: replaceText(message_text[actions].text, textReplace), 
  		reply_markup: {inline_keyboard: addButtons.concat(message_text[actions].buttons)}, 
  		parse_mode: 'Markdown'
  	}).then(function(msg){
      telegramBot.deleteMessage(chatId, msgId).then(function(msg){}).catch(function(err){console.log(`Ошибка при удалении сообщения ${chatId} - ${err}`)});
      if (data != '') telegramBot.deleteMessage(chatId, msgId-1).then(function(msg){}).catch(function(err){console.log(`Ошибка при удалении сообщения ${chatId} - ${err}`)});
      db.run("UPDATE usersInfo SET lastAction=? WHERE userId=?", [action, chatId],function(err,rows){});
    }).catch(function(err){console.log(`Ошибка при отправлении сообщения ${chatId} - ${err}`)});
  }

  /// Заменить текст (?)
  function replaceText(text, data) {
    if (data != '') {
      for (var i = 0; i < data.length; i++) {
        text = text.replace('(?)', data[i]);
      }
    }
    return text
  }
}

//////////////////////////
//                      //
//   ПОДКЛЮЧЕНИЕ К БД   //
//                      //
//////////////////////////
async function db_all(query) {
  return new Promise(function(resolve,reject) {
    db.all(query, function(err,rows) {
      if (err) return reject(err);
      resolve(rows);
    })
  })
}

db = new sqlite3.Database('./AVITO69.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log('Ошибка базы данных: ', err);
    createDatabase();
  } else {
    telegramBot = new TelegramBot('KEY', {polling: true});
    //////////////////////////
    //                      //
    //      ОБРАБОТКА       //
    //                      //
    //////////////////////////
    /// Обработка сообщений от пользователя
    telegramBot.on('message', function (msg) {
      db.serialize(() => {
        db.all(`SELECT userID, lastAction FROM usersInfo WHERE userID = ${msg.chat.id}`, (err, row) => {
          if (row.length > 0) {
            text = msg.text;
            if (msg.text !== undefined) if (msg.text.indexOf('checkDepositBalance') != -1) text = '';
            /// Отправить сообщение пользователю
            if (row[0].lastAction.indexOf("*") != -1) sendMessage(msg.chat.id, msg.message_id, row[0].lastAction, text);
            else sendMessage(msg.chat.id, msg.message_id, 'mainWindow');
          } else {
            /// Добавить пользователя в базу данных
            myReferal = (msg.text.indexOf('/start ') != -1) ? msg.text.split('/start ')[1] : '';
            db.run(`INSERT INTO usersInfo (userID, firstName, userName, dateRegistration, balance, balanceDeposits, tempBalanceDeposit, lastAction, tempPromotion, tempPromotionCount, myReferal, earningTaskCount, referalsEarning, earningType, promotionsCount, adminEarning, balanceCashout, referalsCount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [msg.chat.id, msg.from.first_name, msg.from.username, new Date().toString(), 0.00, '', '', 'mainWindow', '', '', myReferal, 0, 0, '', 0, 0.00, '', 0], async (err) => {
              if (!err) sendMessage(msg.chat.id, msg.message_id, 'mainWindow');
              if (myReferal != '') {
                row = await db_all(`SELECT referalsCount FROM usersInfo WHERE userID = ${myReferal}`).then(function(row) {return row});
                await db.run("UPDATE usersInfo SET referalsCount=? WHERE userID=?", [row[0].referalsCount + 1, Number(myReferal)],function(err,rows){});
                telegramBot.sendMessage(Number(myReferal), `${msg.from.first_name} зарегистрировался по вашей реферальной ссылке!`);
              }
            })
          }
        })
      })
    });
    /// Обработка нажатий на кнопки от пользователя
    telegramBot.on('callback_query', function (msg) {
      db.serialize(() => {
        db.all(`SELECT userID, lastAction FROM usersInfo WHERE userID = ${msg.from.id}`, (err, row) => {
          if (row.length > 0) {
            /// Отправить сообщение пользователю
            sendMessage(msg.from.id, msg.message.message_id, msg.data);
            telegramBot.answerCallbackQuery(msg.id);
          } else {
            /// Добавить пользователя в базу данных
            db.run(`INSERT INTO usersInfo (userID, firstName, userName, dateRegistration, balance, balanceDeposits, tempBalanceDeposit, lastAction, tempPromotion, tempPromotionCount, myReferal, earningTaskCount, referalsEarning, earningType, promotionsCount, adminEarning, balanceCashout, referalsCount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [msg.from.id, msg.from.first_name, msg.from.username, new Date().toString(), 0.00, '', '', 'mainWindow', '', '', '', 0, 0, '', 0, 0.00, '', 0], async (err) => {
              if (!err) sendMessage(msg.from.id, msg.message_id, 'mainWindow');
            })
          }
        })
      })
    })
  }
})