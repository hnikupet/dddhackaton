class Risk {
  constructor(buildingAge) {
    this.buildingAge = buildingAge;
    this.risks = {
      brickFacade:{life:40,riskLevel:0.15,severity:7},
      secondaryStructuralSteelwork:{life:60,riskLevel:0.05,severity:8},
      doorAndWindowFraming{:life:25,riskLevel:0.25,severity:1},
      loadBearingMasonry:{life:60,riskLevel:0.2,severity:8},
      nonloadBearingConcreteWalls:{life:60,riskLevel:0.2,severity:5},
      fireInsulation:{life:60,riskLevel:0.12,severity:8},
      tileRoof:{life:45,riskLevel:0.12,severity:5},
      heatingPipes:{life:50,riskLevel:0.15,severity:5},
      sewerPipes:{life:50,riskLevel:0.2,severity:5},
    };
  }
  
  getProbability(year) {
    return 'foo'
  }

}