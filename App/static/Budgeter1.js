var $j = jQuery.noConflict();

$j(document).ready(function () {
        function add(a, b) {
            return a + b;
        }

        // Constants
        var salaries = [350, 400, 300, 325]; // Salaries from week to week
        var salary = salaries[week];
        var misc_titles = "Social Activity*High-Tech Purchase*Painkillers*Birthday Gift*Repair Fees*Barber Fees*Streaming Service*National Park*Car Repair*Yard Sale*Clothing Shop*Concert Tickets".split("*");
        var misc_texts = "Your friends are going to watch the latest action flick at the IMAX theater in town, then going out for drinks after. Do you join them?*A tech product you've had your eyes on for a long time is sold at a 50% discount this week. Do you buy it?*You wake up with a bad tooth ache, and you are out of painkillers at home. Do you go to the pharmacy to buy painkillers?*Your best friend is turning 30 this week, you have have the perfect gift idea for him. Do you buy it?*Your oven broke, and you cannot use it anymore to cook. Do you call someone to fix it?*It has been a while since you last had a haircut, and a nice barbershop has opened near your house. Do you try it?*A video streaming website is offering a one-time deal: -50% on its yearly subscription. Do you accept the deal?*You are considering going on a hike to a National Park this week-end, but you need to pay for the entrance and camping fees. Do you go?*Your car engine started making some strange noises last week, and it is not getting better. Do you take it to the garage for an inspection?*Your neighbors are doing a yard sale, and you spot a nice wooden desk at a very attractive price. Do you buy it?*You have not purchased new clothes in a while, and you just happen to have a date this week. Would you use the occasion to buy a nice shirt and a pair of pants?*A musician that you like a lot is touring in town next month. Do you buy tickets to the show?".split("*");
        var misc_prices = "35*150*20*40*200*30*60*45*250*100*120*30".split("*");
        var misc_declined = "You will not join your friends*You will not buy the tech product*You will not buy painkillers*You will not buy the birthday present*You will wait to fix your oven*You will not get a haircut*You will not subscribe to the streaming service*You will not go to the National Park*You will wait and hope for the best*You will not buy the wooden desk*You will not buy new clothes*You will not attend the concert".split("*");

        var mealprices = [3.34, 7.76, 12.15];
        var rent = 225;

        // Variables holding contextual informations about the page viewed.
        var tabid = 0;
        var choices = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        var timespent = 0;


        // Variable holding the balance of the different accounts.
        var cardbalance = 0;
        var fundbalance = 0;

        var amountspent = 0;
        var foodfromcard = 0;
        var foodfromfund = 0;

        var miscfromcard = 0;
        var miscfromfund = 0;

        var carddiff = 0;
        var funddiff = 0;

        // Type of Fund: correctly displays "Food Card" or "Special Card" on the different pages.
        var fundtypecaps = "";
        var funduses = "";
        if (fundtype == "food") {
            fundtypecaps = "Food";
            funduses = "to pay for groceries, but not for other types of expenses."

        } else {
            fundtypecaps = "Special";
            funduses = "to pay for any kind of expenses (hobbies, groceries, social activities, etc...), rent excluded."
        }

        // Initialize the navigation tabs.
        $j("#tabs").tabs();

        function initRecurringPage() {
            $j('#txt-funduses').text(funduses);

            $j("#tabs").tabs({
                active: 0,
                disabled: [1, 2]

            });

            $j('.txt-salaryinit').text(salary);
            $j('.txt-fundinit').text(fundpastbalance);
            $j('.txt-rent').text(rent);

            $j("#panel-salary").find('.panel-body').slideUp();
            $j("#panel-rent").find('.panel-body').slideUp();

            $j("#btn-cashfund").button().click(function () {
                $j("#btn-cashfund").button("option", "disabled", true);
                addMoneyTo("Fund", fundpastbalance);
                addRow("Income", fundtypecaps + " Card", 0, fundpastbalance);
                refreshTotal();
                $j("#panel-fund").find('.panel-body').slideUp();
                $j("#panel-salary").find('.panel-body').slideDown();
            });
            $j("#btn-cashsalary").button().click(function () {
                $j("#btn-cashsalary").button("option", "disabled", true);
                addMoneyTo("Card", salary);
                addRow("Income", "Weekly Salary", salary, 0);
                refreshTotal();
                $j("#panel-salary").find('.panel-body').slideUp();
                $j("#panel-rent").find('.panel-body').slideDown();
            });
            $j("#btn-payrent").button().click(function () {
                $j("#btn-payrent").button("option", "disabled", true);
                payMoneyFrom("Card", rent);
                addRow("Expenditure", "Weekly Rent", rent, 0);
                refreshTotal();
                $j("#panel-rent").find('.panel-body').slideUp();
                $j("#btn-togroceries").show();
            });

            $j("#btn-togroceries").button().click(function () {
                $j("#tabs").tabs("option", "disabled", [0, 2]);
                $j("#tabs").tabs("option", "active", 1);
                timespent = $j.now();
            });
            $j(document).tooltip();
        }

        function initGroceryPage() {
            $j("#panel-checkout").find('.panel-body').slideUp();
            $j("#title-checkout").text("Checkout");
            //noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
            $j(".spinner").spinner({
                icons: {down: "ui-icon-minus", up: "ui-icon-plus"},
                max: 14,
                min: 0,
                spin: function (event, ui) {
                    checkTotalMeal(event, ui);
                },
                stop: function (event, ui) {
                    checkTotalMeal(event, ui);
                },
                change: function (event, ui) {
                    checkTotalMeal(event, ui);
                }
            });

            $j("#input-thriftymeals").width(25).spinner("value", 0);
            $j("#input-regularmeals").width(25).spinner("value", 0);
            $j("#input-indulgentmeals").width(25).spinner("value", 0);
            $j("#input-nmeals").width(35);
            $j("#btn-tocheckout").button({
                disabled: true
            }).click(function () {
                toCheckOut();
            });
            $j("#btn-payfoodfromcard").button().click(function () {
                payFoodWith("Card");
            });
            $j("#btn-payfoodfromfund").button().click(function () {
                payFoodWith("Fund");
            });
            $j("#btn-tostore").button().click(function () {
                toStore();
            });

            $j("#btn-tomisc").button().click(function () {
                timespent = $j.now() - timespent;
                $j("#tabs").tabs("option", "disabled", [0, 1]);
                $j("#tabs").tabs("option", "active", 2);
            });
            $j(document).tooltip();


        }

        function initMiscPage(week) {
            $j(".misctxts").each(function (index) {
                $j(this).html(misc_texts[week * 3 + index] + '<br> Total cost: $' + misc_prices[week * 3 + index]);
            });

            $j(".misctitles").each(function (index) {
                $j(this).text(misc_titles[week * 3 + index]);
            });

            $j("#accordion-misc").accordion({
                collapsible: true,
                active: false,
                heightStyle: "content",
                beforeActivate: miscTabRefresh
            });
            $j(".btn-paymiscfromcard").button().click(function () {
                payMiscWith("Card");
            });
            $j(".btn-paymiscfromfund").button().click(function () {
                payMiscWith("Fund");
            });
            $j(".btn-rejectoffer").button().click(function () {
                createMiscDialog("Reject");
                $j("#dialog-paymisc").dialog("open");
            });
            $j("#btn-tonextweek").button().click(toNextWeek)

        }

        function miscTabRefresh(event, ui) {
            if (ui.newPanel.length != 0) {
                tabid = parseInt(ui.newPanel[0].id.slice(-1));
                amountspent = misc_prices[week * 3 + tabid];
                refreshTotal("misc");
            } else {

            }

        }

        function getFoodTotal() {
            var spins = $j(".spinner");
            var total = 0;
            for (var i = 0; i < spins.length; i++) {
                total = total + parseInt(spins[i].value) * mealprices[i]
            }
            return parseFloat(total.toFixed(2));
        }


        function createMiscDialog(dialogtype) {
            var baseprompt = 'You are about to pay $<span class="txt-miscamount">&nbsp;</span> using your ';
            var prompt = "";
            var buttons = {};
            var misctitle = misc_titles[week * 3 + tabid];
            if (dialogtype == "Reject") {
                prompt = misc_declined[week * 3 + tabid] + '. Do you confirm this action?';
                buttons = {
                    Ok: function () {
                        processMiscRejection();
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                };
            }
            if (dialogtype == "FundDenied") {
                prompt = 'You cannot use your <span class="txt-fundtype">food</span> card for this transaction. Please pay using your debit card.';
                buttons = {
                    Ok: function () {
                        $j(this).dialog("close");
                    }
                };
            } else if (dialogtype == "FundFull") {
                prompt = baseprompt + '<span class="txt-fundtype">food</span> card.';
                buttons = {
                    "Proceed with the transaction": function () {
                        processMiscTransaction(misctitle, 0, miscfromfund);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "CardFull") {
                prompt = baseprompt + 'debit card.';
                buttons = {
                    "Proceed with the transaction": function () {
                        processMiscTransaction(misctitle, miscfromcard, 0);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "FundSplit") {
                prompt = baseprompt + '<span class="txt-fundtype">food</span> card, but you only have $<span class="txt-fundbalance">&nbsp;</span> left on this card. <br><br>The extra $<span class="txt-funddiff">&nbsp;</span> will be paid using your debit card.';
                buttons = {
                    "Proceed with both transactions": function () {
                        processMiscTransaction(misctitle, miscfromcard, miscfromfund);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "CardSplit") {
                prompt = baseprompt + 'debit card, but you only have $<span class="txt-cardbalance">&nbsp;</span> left on this card. <br><br>The extra $<span class="txt-carddiff">&nbsp;</span> will be paid using your <span class="txt-fundtype">food</span> card.';
                buttons = {
                    "Proceed with both transactions": function () {
                        processMiscTransaction(misctitle, miscfromcard, miscfromfund);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "FundEmpty") {
                prompt = 'Your <span class="txt-fundtype">food</span> card is depleted. Please pay using your debit card.';
                buttons = {
                    Ok: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "Denied") {
                prompt = 'Your total balance is insufficient for this transaction of $<span class="txt-miscamount">&nbsp;</span>.';
                buttons = {
                    Ok: function () {
                        $j(this).dialog("close");
                    }
                }
            }

            $j("#txt-miscprompt").html(prompt);
            $j("#dialog-paymisc").dialog({
                resizable: false,
                autoOpen: false,
                height: "auto",
                width: 500,
                modal: true,
                buttons: buttons
            });
            refreshTotal("misc");
        }


        function createGroceriesDialog(dialogtype) {
            var baseprompt = 'You are about to buy $<span class="txt-foodamount">&nbsp;</span> in groceries using your ';
            var prompt = "";
            var buttons = {};

            if (dialogtype == "FundFull") {
                prompt = baseprompt + '<span class="txt-fundtype">food</span> card.';
                buttons = {
                    "Proceed with the transaction": function () {
                        processFoodTransaction(0, foodfromfund);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "CardFull") {
                prompt = baseprompt + 'debit card.';
                buttons = {
                    "Proceed with the transaction": function () {
                        processFoodTransaction(foodfromcard, 0);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "FundSplit") {
                prompt = baseprompt + '<span class="txt-fundtype">food</span> card, but you only have $<span class="txt-fundbalance">&nbsp;</span> left on this card. <br><br>The extra $<span class="txt-funddiff">&nbsp;</span> will be paid using your debit card.';
                buttons = {
                    "Proceed with both transactions": function () {
                        processFoodTransaction(foodfromcard, foodfromfund);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "CardSplit") {
                prompt = baseprompt + 'debit card, but you only have $<span class="txt-cardbalance">&nbsp;</span> left on this card. <br><br>The extra $<span class="txt-carddiff">&nbsp;</span> will be paid using your <span class="txt-fundtype">food</span> card.';
                buttons = {
                    "Proceed with both transactions": function () {
                        processFoodTransaction(foodfromcard, foodfromfund);
                        $j(this).dialog("close");
                    },
                    Cancel: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "FundEmpty") {
                prompt = 'Your <span class="txt-fundtype">food</span> card is depleted. Please pay using your debit card.';
                buttons = {
                    Ok: function () {
                        $j(this).dialog("close");
                    }
                }
            } else if (dialogtype == "Denied") {
                prompt = 'Your total balance is insufficient to pay for $<span class="txt-foodamount">&nbsp;</span> in groceries. Please adjust your menu choices';
                buttons = {
                    Ok: function () {
                        $j(this).dialog("close");
                    }
                }
            }

            $j("#txt-groceriesprompt").html(prompt);
            $j("#dialog-paygroceries").dialog({
                resizable: false,
                autoOpen: false,
                height: "auto",
                width: 500,
                modal: true,
                buttons: buttons
            });
            refreshTotal("food");
        }

        function addRow(cat, title, fromcard, fromfund) {
            var rowclass = "";
            var sign = "";
            var row = "";
            if (cat == "Income") {
                rowclass = "success";
                sign = "+"
            } else {
                rowclass = "danger";
                sign = "-"
            }
            if (fromcard == 0) {
                row = '<tr class="' + rowclass + '"><td>' + title + '</td><td>&nbsp;</td><td>' + sign + ' $' + fromfund + '</td></tr>';
            } else if (fromfund == 0) {
                row = '<tr class="' + rowclass + '"><td>' + title + '</td><td>' + sign + ' $' + fromcard + '</td><td>&nbsp;</td></tr>';
            } else {
                row = '<tr class="' + rowclass + '"><td>' + title + '</td><td>' + sign + ' $' + fromcard + '</td><td>' + sign + ' $' + fromfund + '</td></tr>';
            }
            $j('#tablebudget1').append(row);
            $j('#tablebudget2').append(row);
            $j('#tablebudget3').append(row);
        }

        function payMoneyFrom(fundtype, amount) {
            if (fundtype == "Card") {
                cardbalance = parseFloat((cardbalance - amount).toFixed(2));
            } else {
                fundbalance = parseFloat((fundbalance - amount).toFixed(2));
            }
        }

        function addMoneyTo(fundtype, amount) {
            if (fundtype == "Card") {
                cardbalance = parseFloat((cardbalance + amount).toFixed(2));
            } else {
                fundbalance = parseFloat((fundbalance + amount).toFixed(2));
            }
        }

        function payFoodWith(source) {
            if ((fundbalance + cardbalance) < amountspent) {
                foodfromcard = 0;
                foodfromfund = 0;
                createGroceriesDialog("Denied");
                $j("#dialog-paygroceries").dialog("open");
            } else if (source == "Fund") {
                if (fundbalance == 0) {
                    foodfromcard = 0;
                    foodfromfund = 0;
                    createGroceriesDialog("FundEmpty");
                    $j("#dialog-paygroceries").dialog("open");
                } else if (funddiff <= 0) {
                    foodfromcard = 0;
                    foodfromfund = amountspent;
                    createGroceriesDialog("FundFull");
                    $j("#dialog-paygroceries").dialog("open");

                } else {
                    foodfromcard = funddiff;
                    foodfromfund = fundbalance;
                    createGroceriesDialog("FundSplit");
                    $j("#dialog-paygroceries").dialog("open");
                }
            } else if (source == "Card") {
                if (carddiff <= 0) {
                    foodfromcard = amountspent;
                    foodfromfund = 0;
                    createGroceriesDialog("CardFull");
                    $j("#dialog-paygroceries").dialog("open");
                } else {
                    foodfromcard = cardbalance;
                    foodfromfund = carddiff;
                    createGroceriesDialog("CardSplit");
                    $j("#dialog-paygroceries").dialog("open");
                }
            }
        }


        function payMiscWith(source) {
            if (fundtype == "food") {
                if (source == "Fund") {
                    createMiscDialog("FundDenied");
                    $j("#dialog-paymisc").dialog("open");
                } else if (cardbalance < amountspent) {
                    miscfromcard = 0;
                    miscfromfund = 0;
                    createMiscDialog("Denied");
                    $j("#dialog-paymisc").dialog("open");
                } else {
                    miscfromcard = amountspent;
                    miscfromfund = 0;
                    createMiscDialog("CardFull");
                    $j("#dialog-paymisc").dialog("open");
                }
            } else {
                if ((fundbalance + cardbalance) < amountspent) {
                    miscfromcard = 0;
                    miscfromfund = 0;
                    createMiscDialog("Denied");
                    $j("#dialog-paymisc").dialog("open");
                } else if (source == "Fund") {
                    if (fundbalance == 0) {
                        miscfromcard = 0;
                        miscfromfund = 0;
                        createMiscDialog("FundEmpty");
                        $j("#dialog-paymisc").dialog("open");
                    } else if (funddiff <= 0) {
                        miscfromcard = 0;
                        miscfromfund = amountspent;
                        createMiscDialog("FundFull");
                        $j("#dialog-paymisc").dialog("open");

                    } else {
                        miscfromcard = funddiff;
                        miscfromfund = fundbalance;
                        createMiscDialog("FundSplit");
                        $j("#dialog-paymisc").dialog("open");
                    }
                } else if (source == "Card") {
                    if (carddiff <= 0) {
                        miscfromcard = amountspent;
                        miscfromfund = 0;
                        createMiscDialog("CardFull");
                        $j("#dialog-paymisc").dialog("open");
                    } else {
                        miscfromcard = cardbalance;
                        miscfromfund = carddiff;
                        createMiscDialog("CardSplit");
                        $j("#dialog-paymisc").dialog("open");
                    }
                }
            }
        }

        function checkTotalMeal() {
            var nums = $j(".spinner").map(function () {
                return parseInt($j(this).spinner("value"));
            }).get();
            var n_meals = nums.reduce(add, 0);
            $j("#input-nmeals").val(n_meals);
            if (n_meals == 14) {
                $j("#btn-tocheckout").button("option", "disabled", false);
            } else {
                try {
                    $j("#btn-tocheckout").button("option", "disabled", true);
                }
                catch (err) {

                }
            }
        }

        function toCheckOut() {
            refreshTotal("food");
            $j("#title-checkout").text("Total on Groceries: $" + amountspent);
            $j(".spinner").spinner("option", "disabled", true);
            $j("#btn-tocheckout").button("option", "disabled", true);
            $j("#panel-checkout").find('.panel-body').slideDown();
            $j("#panel-meals").find('.panel-body').slideUp();

        }


        function toStore() {
            $j("#title-checkout").text("Checkout");
            $j(".spinner").spinner("option", "disabled", false);
            $j("#btn-tocheckout").button("option", "disabled", false);
            $j("#title-checkout").text("Checkout");
            $j("#panel-checkout").find('.panel-body').slideUp();
            $j("#panel-meals").find('.panel-body').slideDown();
        }

        function refreshTotal(expensetype) {
            if (expensetype == "food") {
                amountspent = getFoodTotal();
                $j(".txt-foodamount").text(amountspent);
            } else if (expensetype == "misc") {
                $j(".txt-miscamount").text(amountspent);
            }
            carddiff = parseFloat((amountspent - cardbalance).toFixed(2));
            funddiff = parseFloat((amountspent - fundbalance).toFixed(2));
            $j(".txt-cardbalance").text(cardbalance);
            $j(".txt-fundbalance").text(fundbalance);
            $j(".txt-carddiff").text(carddiff);
            $j(".txt-funddiff").text(funddiff);
            $j(".txt-fundtype").text(fundtype);
            $j(".txt-fundtypecaps").text(fundtypecaps);
        }


        function processFoodTransaction(foodfromcard, foodfromfund) {
            addRow("Expense", "Groceries", foodfromcard, foodfromfund);
            payMoneyFrom("Card", foodfromcard);
            payMoneyFrom("Fund", foodfromfund);
            foodhistorysalary.push(foodfromcard);
            foodhistoryfund.push(foodfromfund);
            refreshTotal("food");
            $j("#panel-checkout").find('.panel-body').slideUp();
            $j("#btn-tomisc").show();
        }


        function processMiscTransaction(misctitle, miscfromcard, miscfromfund) {
            addRow("Expense", misctitle, miscfromcard, miscfromfund);
            payMoneyFrom("Card", miscfromcard);
            payMoneyFrom("Fund", miscfromfund);
            refreshTotal("misc");
            $j("#body-misc" + tabid).addClass("ui-state-disabled");
            $j("#title-misc" + tabid).addClass("ui-state-disabled");
            $j("#accordion-misc").accordion("option", "active", false);
            choices[week * 3 + tabid] = 1;
        }

        function processMiscRejection() {
            $j("#body-misc" + tabid).addClass("ui-state-disabled");
            $j("#title-misc" + tabid).addClass("ui-state-disabled");
            $j("#accordion-misc").accordion("option", "active", false);
            choices[week * 3 + tabid] = 0;
        }

        function toNextWeek() {
            if ($j.inArray(-1, choices.slice(week * 3, (week + 1) * 3)) == -1) {
                alert("Week " + (week + 1) + " is over. Now starting Week " + (week + 2));
                fundhistory.push(fundbalance);
                salaryhistory.push(cardbalance);
                timespenthistory.push(timespent);
                $j.redirect(redirpath, {
                    "fundpastbalance": fundbalance, "salarypastbalance": cardbalance,
                    "weeknumber": (week + 1), "foodhistorysalary": foodhistorysalary.join("*"),
                    "foodhistoryfund": foodhistoryfund.join("*"), "salaryhistory": salaryhistory.join("*"),
                    "fundhistory": fundhistory.join("*"), "timespenthistory": timespenthistory.join("*"),
                    "miscchoices": choices.join("*")
                })
            } else {
                alert("You must make a choice on all transactions before proceeding to next week.")
            }
        }

        initRecurringPage();
        initGroceryPage();
        initMiscPage(week);
        checkTotalMeal();
        refreshTotal("food");
        $j(".container").show();
        $j("#errormessage").hide();
    }
);