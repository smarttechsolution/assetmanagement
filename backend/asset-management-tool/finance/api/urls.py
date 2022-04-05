from django.urls import path
from .views import *

app_name = "finance"

urlpatterns = [
    path('income-category/list/<str:water_scheme_slug>/', IncomeCategoryListView.as_view(), name = 'income-category-list'),
    path('income-category/create/', IncomeCategoryCreateView.as_view(), name = 'income-category-create'),
    path('income-category/update/<int:pk>/', IncomeCategoryUpdateView.as_view(), name = 'income-category-update'),
    path('income-category/delete/<int:pk>/', IncomeCategoryDeleteView.as_view(), name = 'income-category-delete'),

    path('expense-category/list/<str:water_scheme_slug>/', ExpenseCategoryListView.as_view(), name = 'expense-category-list'),
    path('expense-category/create/', ExpenseCategoryCreateView.as_view(), name = 'expense-category-create'),
    path('expense-category/update/<int:pk>/', ExpenseCategoryUpdateView.as_view(), name = 'expense-category-update'),
    path('expense-category/delete/<int:pk>/', ExpenseCategoryDeleteView.as_view(), name = 'expense-category-delete'),

    path('income/<str:lang>/list/<str:water_scheme_slug>/', IncomeListView.as_view(), name = 'income-list'),
    path('income/<str:lang>/create/',IncomeCreateView.as_view(),name = 'income-create'),
    path('income/<str:lang>/update/<int:pk>/', IncomeUpdateView.as_view(), name = 'income-update'),
    path('income/delete/<int:pk>/', IncomeDeleteView.as_view(), name = 'income-delete'),
    path('income/<str:lang>/list-all/<str:water_scheme_slug>/',IncomeAllListdView.as_view()),

    path('expenditure/<str:lang>/list/<str:water_scheme_slug>/', ExpenseListView.as_view(), name = 'expense-list'),
    path('expenditure/<str:lang>/create/',ExpenseCreateView.as_view(),name = 'expense-create'),
    path('expenditure/<str:lang>/update/<int:pk>/', ExpenseUpdateView.as_view(), name = 'expense-update'),
    path('expenditure/delete/<int:pk>/', ExpenseDeleteView.as_view(), name = 'expense-delete'),
    path('expenditure/<str:lang>/list-all/<str:water_scheme_slug>/',ExpenseAllListdView.as_view()),

    path('close-income-expense/<str:lang>/',CloseIncomeExpenseView.as_view(), name = 'close-income'),
    path('income-expense/image-by-month/<str:lang>/<str:water_scheme_slug>/',CashBookImageView.as_view()),

    path('present-previous-month/income-total/<str:lang>/<str:water_scheme_slug>/',MonthIncomeTotal.as_view(), name ='month-income-total'),
    path('present-previous-month/expenditure-total/<str:lang>/<str:water_scheme_slug>/',MonthExpenditureTotal.as_view(), name ='month-expense-total'),

    path('income-expense/closed-month/<str:lang>/',CashBookClosingMonthView.as_view()),

    path('report/income-expense/<str:lang>/<str:water_scheme_slug>/',IncomeExpenditureReport.as_view()),
    path('report/income-by-category/<str:water_scheme_slug>/',IncomeDistributionReportByCategory.as_view()),
    path('report/expense-by-category/<str:water_scheme_slug>/',ExpenseDistributionReportByCategory.as_view()),
    # path('report/actual-cumulative-cash-flow/<str:water_scheme_slug>/',ActualCumulativeCashFlowReport.as_view()),
    path('report/expected-income-expense-cumulative-cash/<str:water_scheme_slug>/',ExpectedIncomeExpenseCumulativeCashReport.as_view()),
    # path('report/expected-expense/<str:lang>/<str:water_scheme_slug>/',ExpectedExpenseCashReport.as_view()),

    path('tariff/get-list/<str:water_scheme_slug>/',TariffListWithExpectedIncome.as_view())
]
