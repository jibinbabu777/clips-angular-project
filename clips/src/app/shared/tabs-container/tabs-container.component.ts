import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
//Use to get the QueryList of elements or directives from the content DOM
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent> 

  constructor() { }

  ngAfterContentInit(): void {
      const activeTabs = this.tabs?.filter(
        tab => tab.active
      )

      if(!activeTabs || activeTabs.length===0){
        this.selectTabs(this.tabs!.first)
      }
  }
  selectTabs(tab: TabComponent){
    this.tabs?.forEach(
      tab=> tab.active =false
    )
    tab.active=true;
    //preventing default behaviour
    return false;
  }
}
