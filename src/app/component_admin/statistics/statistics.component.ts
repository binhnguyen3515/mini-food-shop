import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { validateAllFormFields } from 'src/app/common/validators';
import { CountryInfo, EnergyDescription, ExampleService } from './example.service';
import { FirstRowContentService } from './first-row-content.service';
import { CategoryData, IncomeByDateData, SecondRowContentService } from './second-row-content.service';

import ArrayStore from 'devextreme/data/array_store';
import { DxChartComponent } from 'devextreme-angular';
import { CategoryByProductNumber, InvoiceData, ThirdRowContentService } from './third-row-content.service';
import { ExpenseAndRevenue, FourthRowContentService, TopSold } from './fourth-row-content.service';
import { DataItem, PaletteService } from './palette.service';
import { getPalette } from 'devextreme/viz/palette';
import { CompanyPositionLevel, FifthRowContentService, ProductRating } from './fifth-row-content.service';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  preserveWhitespaces: true,
})
export class StatisticsComponent implements OnInit {
  @ViewChild('entity', { static: true })setEntity!:string;

  obs$!:Subscription;
  
  constructor(
    // private service: ExampleService,
    private firstRowContent:FirstRowContentService,
    private secondRowService:SecondRowContentService,
    private thirdRowService:ThirdRowContentService,
    private fourthRowService:FourthRowContentService,
    private fifthRowContentService:FifthRowContentService,
    private fb: FormBuilder,
    private paletteService:PaletteService) { 

      this.data = paletteService.getData();
      this.paletteExtensionModes = paletteService.getPaletteExtensionModes();
      this.paletteCollection = paletteService.getPaletteCollection();
      this.palette = this.paletteCollection[0];
      this.paletteExtensionMode = 'Blend';

    this.dateChooseMode = new ArrayStore({
      data:this.dateList,
      key:'id'
    })
  }

  refresh(){
    this.ngOnInit();
  }

  ngOnInit() {
    this.setEntity = "Dashboard";
    //1st row
    this.obs$ = this.firstRowContent.firstRowDataService.pipe(
      map((data:any) => {
        this.firstRowContent$ = data;
      })).subscribe();
    //1st row edge

    //2nd row
    this.obs$ = this.loadFirstBarChart.subscribe();
    this.obs$ = this.loadFirstLineChart("week").subscribe(); 
    //2nd row edge

    //3rd row
    this.obs$ = this.loadFirstPieChart.subscribe();
    this.obs$ = this.loadFirstFullStackedBar.subscribe();
    this.obs$ = this.loadSideBySideFullStackedBar.subscribe();
    //3rd row edge

    //4th row
    this.obs$ = this.loadFirstSpineChart('week').subscribe();
    this.obs$ = this.loadSecondBarChart.subscribe();
    //4th row edge

    //5th row
    this.obs$ = this.loadFirstPyramidChart.subscribe();
    this.obs$ = this.loadFirstMultipleAxesChart.subscribe();
    //5th row edge
    // this.obs$ = this.fourthRowService.top10Sold.subscribe((e)=>console.log(e));

  }
  
  //1st row content
  firstRowContent$!:any;
  //1st row content edge
  
  //2nd row content
  get loadFirstBarChart(){
    return this.secondRowService.categoryService.pipe(
      map((data:any) => {
        this.productSoldByCategory$ = data as CategoryData[];
      }))
  }
  productSoldByCategory$!:CategoryData[];
  formDatePicker1 = this.fb.group({
    startDate:['',[Validators.required]],
    endDate:['',[Validators.required]],
  })

  submitDateRange1(){
    console.log(this.formDatePicker1.value);
    if(this.formDatePicker1.valid){
      this.obs$ = this.secondRowService.categoryService_DateRange(this.formDatePicker1.value).pipe(
        map((data:any) => {
          this.productSoldByCategory$ = data as CategoryData[];
        })
        ).subscribe();
    }else{
      validateAllFormFields(this.formDatePicker1);
    }
  }
  resetDateRange1(){
    this.formDatePicker1.reset();
    this.obs$ = this.loadFirstBarChart.subscribe();
  }
  //2nd row content edge

  

  //2nd row line chart
  incomeByDate$!:IncomeByDateData[];
  overlappingModes: string[] = ['stagger', 'rotate', 'hide', 'none'];
  currentMode: string = this.overlappingModes[0];
  dateChooseMode:any;
  dateList: any[]=[
    {id:"week",value:'Last 7 days'},
    {id:"fourteen",value:'Last 14 days'},
    {id:"thirty",value:'Last 30 days'},
  ]
  loadFirstLineChart(value:string){
    return this.secondRowService.getFirstChartData(value).pipe(
      map((data: IncomeByDateData[]) =>
        this.incomeByDate$ = data
      )
    )
  }
  chooseDateRange(value:string){
    console.log(value);
    this.obs$ = this.loadFirstLineChart(value).subscribe();
  }
  //2nd row line chart edge

  //third row pie chart
  invoiceByStatus$!:InvoiceData[];
  get loadFirstPieChart(){
    return this.thirdRowService.invoiceByStatusService.pipe(
      map((data:InvoiceData[])=>this.invoiceByStatus$ = data as InvoiceData[])
    )
  }
  customizeLabel(point:any) {
    return `${point.argumentText}: ${point.valueText}%`;
  }

  categoryByProductNumberOverTheTime$!:CategoryByProductNumber[];
  get loadFirstFullStackedBar(){
    return this.thirdRowService.ImportedByCateOverTheTimeData.pipe(
      map((data:any) => this.categoryByProductNumberOverTheTime$ = data as CategoryByProductNumber[])
    )
  }
  customizeTooltip(arg: any) {
    return {
      text: `${arg.percentText} - ${arg.valueText}`,
    };
  }

  categoryByExpenseOverTheTime$!:CategoryByProductNumber[];
  get loadSideBySideFullStackedBar(){
    return this.thirdRowService.importedExpenseByCateOverTheTimeData.pipe(
      map((data:any) => this.categoryByExpenseOverTheTime$ = data as CategoryByProductNumber[])
    )
  }
  customizeItems(items:any) {
    const sortedItems:any = [];

    items.forEach((item:any) => {
      const startIndex = item.series.stack === 'Main' ? 0 : 3;
      sortedItems.splice(startIndex, 0, item);
    });
    return sortedItems;
  }
  //third row pie chart edge

  //fourth row
  expenseAndRevenue$!:ExpenseAndRevenue[];
  types: string[] = ['spline', 'stackedspline', 'fullstackedspline'];
  loadFirstSpineChart(dateRange:string){
    return this.fourthRowService.RevenueAndExpensesData(dateRange).pipe(
      map((data:any) =>this.expenseAndRevenue$ = data as ExpenseAndRevenue[]))
  }
  chooseDateRange2(value:string){
    console.log(value);
    this.obs$ = this.loadFirstSpineChart(value).subscribe();
  }

  topSold$!:TopSold[];
  get loadSecondBarChart(){
    return this.fourthRowService.top10Sold.pipe(
      map((data:any) => this.topSold$ = data as TopSold[]))
  }

  formDatePicker2 = this.fb.group({
    startDate:['',[Validators.required]],
    endDate:['',[Validators.required]],
  })

  submitDateRange2(){
    console.log(this.formDatePicker2.value);
    if(this.formDatePicker2.valid){
      this.obs$ = this.fourthRowService.top10SoldByDateRange(this.formDatePicker2.value).pipe(
        map((data:any) => {
          this.topSold$ = data as TopSold[];
        })
        ).subscribe();
    }else{
      validateAllFormFields(this.formDatePicker2);
    }
  }
  resetDateRange2(){
    this.formDatePicker2.reset();
    this.obs$ = this.loadSecondBarChart.subscribe();
  }
  //fourth row edge

  //fifth row
  companyPositionLevel$!:CompanyPositionLevel[];
  get loadFirstPyramidChart(){
    return this.fifthRowContentService.CompanyPositionLevel.pipe(
      map((data:any) => this.companyPositionLevel$ = data as CompanyPositionLevel[])
    )
  }

  productRating$!:ProductRating[];
  get loadFirstMultipleAxesChart(){
    return this.fifthRowContentService.ProductRating.pipe(
      map((data:any) => this.productRating$ = data as ProductRating[])
    )
  }
  customizeTooltip2(arg: any) {
    const items = arg.valueText.split('\n');
    const color = arg.point.getColor();
    items.forEach((item:any, index:any) => {
      if (item.indexOf(arg.seriesName) === 0) {
        const element = document.createElement('span');

        element.textContent = item;
        element.style.color = color;
        element.className = 'active';

        items[index] = element.outerHTML;
      }
    });
    return { text: items.join('\n') };
  }
  //fifth row edge

  //2nd row form getter
  get startDate(){return this.formDatePicker1.get('startDate')};
  get endDate(){return this.formDatePicker1.get('endDate')};
  //2nd row form getter edge
  //4th row form getter
  get startDate2(){return this.formDatePicker2.get('startDate')};
  get endDate2(){return this.formDatePicker2.get('endDate')};
  //4th row form getter edge

  ngOnDestroy(): void { 
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
  

  //palette
  data!: DataItem[];
  paletteCollection!: string[];
  paletteExtensionModes!: string[];
  paletteExtensionMode!: string;
  palette!: string;
  get baseColors() {
    return getPalette(this.palette).simpleSet;
  }
  //palette edge
}
