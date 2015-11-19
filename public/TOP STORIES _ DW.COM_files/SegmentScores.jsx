(function (window, document, $, $S, undefined) {

    var Scoreboards = $S.Scoreboards || {};
    var Templates = Scoreboards.Templates;

    Scoreboards.SegmentsScores = React.createClass({

        getDefaultProps: function () {
            return {
                awayScores: [],
                homeScores: [],
                awayName: null,
                homeName: null,
                allowEditing: false,
                showOvertime: false,
                updateSegmentScores: null,
                updateShortName: null,
                updateScore: null,
                isFrontEnd: false,
				homeScoresOnTop: false
            }
        },

        getInitialState: function () {
            var homeScores = []; awayScores = [];
            
            if(this.props.homeScores.length === 0) {
                homeScores =this.prepareSegmentsFor("home");
            } else {
                homeScores = this.props.homeScores;
            }

            if(this.props.awayScores.length === 0) {
                awayScores= this.prepareSegmentsFor("away");
            } else {
                awayScores = this.props.awayScores;
            }
            return {
                allowEditing: typeof this.props.allowEditing !== "undefined" ? this.props.allowEditing : false,
                sport: this.props.sport,
                awayScores: awayScores,
                homeScores: homeScores,
                awayName: this.props.awayName || "Away",
                homeName:this.props.homeName || "Home",
                showOvertime: true,
				homeScoresOnTop: this.props.homeScoresOnTop
            }
        },

        componentWillReceiveProps: function (nextProps) {
            var currentState = this.state;

            if (nextProps.hasOwnProperty("allowEditing") && nextProps.allowEditing !== this.state.allowEditing) {
                currentState.allowEditing = nextProps.allowEditing;
            }

            if (nextProps.hasOwnProperty("homeScores")) {
                currentState.homeScores = nextProps.homeScores;
            }

            if (nextProps.hasOwnProperty("awayScores")) {
                currentState.awayScores = nextProps.awayScores;
            }

            if (nextProps.hasOwnProperty("homeName")) {
                currentState.homeName = nextProps.homeName;
            }

            if (nextProps.hasOwnProperty("awayName")) {
                currentState.awayName = nextProps.awayName;
            }

            if (nextProps.hasOwnProperty("sport")) {

                if(nextProps.sport && nextProps.sport.key !== currentState.sport.key) {
                    currentState["sport"]  = nextProps.sport;
                    currentState["homeScores"] = this.prepareSegmentsFor("home",nextProps.sport.segments,nextProps.sport.overtime);
                    currentState["awayScores"] = this.prepareSegmentsFor("away",nextProps.sport.segments,nextProps.sport.overtime);

                }

            }

            if(nextProps.hasOwnProperty("showOvertime")){
                currentState["showOvertime"] = nextProps.showOvertime;
            }

			if(nextProps.hasOwnProperty("homeScoresOnTop")){
				currentState["homeScoresOnTop"] = nextProps.homeScoresOnTop;
			}

            this.setState(currentState);
        },

        updateSegmentScores: function (data) {
            var currentState = this.state;
            if (data.teamType === "home") {
                currentState.homeScores[data.index].score = data.target.value;
                if (currentState.homeScores[data.index].hasOwnProperty("overtime") && (!currentState.showOvertime) && data.target.value !== "-") {
                    currentState["showOvertime"] = true;
                }
                this.props.updateScore("home", this.calculateTotalScore(currentState.homeScores));
            }

            if (data.teamType === "away") {
                currentState.awayScores[data.index].score = data.target.value;
                if (currentState.awayScores[data.index].hasOwnProperty("overtime") && (!currentState.showOvertime) && data.target.value !== "-") {
                    currentState["showOvertime"] = true;
                }
                this.props.updateScore("away", this.calculateTotalScore(currentState.awayScores));
            }

            this.setState(currentState);
            this.props.updateSegmentScores(currentState);
        },

        calculateTotalScore: function (scores) {
            var score = 0;
            for (var i = 0; i < scores.length; i++) {
                if (typeof scores[i].score === "number") {
                    score += scores[i].score;
                } else if (typeof scores[i].score === "string") {
                    var s = parseInt(scores[i].score) || 0;
                    score += s;
                }
            }
            return score;
        },

        updateHeaderCell: function (data) {
            var currentState = this.state;
            currentState.awayScores[data.index].seg = data.target.value;
            currentState.homeScores[data.index].seg = data.target.value;
            this.setState(currentState);
        },

        updateName: function (data) {
            var currentState = this.state;

            if (data.teamType === "away") {
                currentState["awayName"] = data.target.value;
            }

            if (data.teamType === "home") {
                currentState["homeName"] = data.target.value;
            }

            this.setState(currentState);
            this.props.updateShortName(data.teamType, data.target.value);

        },

        componentDidMount : function(){
            
            if(this.props.updateSegmentScores) {
                this.props.updateSegmentScores(this.state);
            }
            
        },

        prepareSegmentsFor : function(type,segments,overtimes){
            var segs = [];

            if(typeof segments === "undefined") { segments = this.props.sport.segments; }
            if(typeof overtimes === "undefined") { overtimes = this.props.sport.overtimes; }

            for(var i = 0; i < segments; i++ ) {
                var seg = String(i + 1);
                segs.push({ seg : seg, score: 0 });
            }

            for(var x = 0; x < overtimes; x++) {
                segs.push({ seg : "-", score:"-"});
            }

            return segs;

        },

        showColumnForOvertime: function(homeScore,awayScore){

            if(this.props.hasOwnProperty("isFrontEnd") && this.props.isFrontEnd === true) {
                if(homeScore !== "-" || awayScore !== "-") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }

        },

        componentDidUpdate: function(){
            
            if(this.props.updateSegmentScores) {
                this.props.updateSegmentScores(this.state);
            }
            
        },

        render: function () {
            var that = this;
            var headerTds = [];
            var emptyScoreString = "-";
            

            var homeScores = this.state.homeScores.map(function (item, i) {
                var scoreTdClassName = "segment-score";
                if (i >= that.state.sport.segments) {
                    scoreTdClassName += " overtime";
                    if (that.state.showOvertime) {

                        scoreTdClassName += (that.showColumnForOvertime(item.score, that.state.awayScores[i].score)) ? " show" : '';

                        return (<td className={scoreTdClassName}><Templates.ContentEditable allowEditing={that.state.allowEditing}
                                                               key={i}
                                                               html={item.score} onChange={that.updateSegmentScores}
                                                               index={i}
                                                               teamType="home"/>
                        </td>);
                    }
                    return null;
                }

                return (<td className="segment-score"><Templates.ContentEditable allowEditing={that.state.allowEditing}
                                                       key={i}
                                                       html={item.score} onChange={that.updateSegmentScores}
                                                       index={i}
                                                       teamType="home"/>
                </td>);
            }, that);

            var awayScores = this.state.awayScores.map(function (item, i) {
                var scoreTdClassName = "segment-score";
                if (i >= that.state.sport.segments) {
                    scoreTdClassName += " overtime";
                    if (that.state.showOvertime) {
                        
                        scoreTdClassName += (that.showColumnForOvertime(that.state.homeScores[i].score,item.score)) ? " show" : "";

                        return (<td className={scoreTdClassName}><Templates.ContentEditable allowEditing={that.state.allowEditing}
                                                               key={i}
                                                               html={item.score} onChange={that.updateSegmentScores}
                                                               index={i}
                                                               teamType="away" />
                        </td>);
                    }
                    return null;
                }

                return (<td className="segment-score"><Templates.ContentEditable allowEditing={that.state.allowEditing}
                                                       key={i}
                                                       html={item.score} onChange={that.updateSegmentScores}
                                                       index={i}
                                                       teamType="away" />
                </td>);
            }, that);

            var headerTds = that.state.homeScores.map(function (score, i) {
                var headerTdClassName = "";
                if (i >= that.state.sport.segments) {
                    headerTdClassName = "overtime";
                    if (that.state.showOvertime) {
                        
                        headerTdClassName += (that.showColumnForOvertime(score.score,that.state.awayScores[i].score)) ? " show" : "";

                        return (<td width="40" key={i} className={headerTdClassName}>
                                    <Templates.ContentEditable allowEditing={that.state.allowEditing}
                                                                    html={score.seg}
                                                                    index={i} 
                                                                    onChange={that.updateHeaderCell} />
                                </td>);
                    }
                    return null;
                }

                return (<td width="40" key={i}>{score.seg}</td>);
            });

			var homeRow = 
				<tr>
                    <td className="team-column">
                        <Templates.ContentEditable html={that.state.homeName}
                                                    allowEditing={that.state.allowEditing}
                                                    onChange={that.updateName} teamType="home"/>
                    </td>
                    {homeScores}
				</tr>;				
				

			var awayRow = 
				<tr>
				    <td className="team-column">
                        <Templates.ContentEditable html={that.state.awayName}
                                                    allowEditing={that.state.allowEditing}
                                                    onChange={that.updateName} teamType="away"/>
                    </td>
                    {awayScores}
				</tr>;				


			var scoreRows;
			if (this.state.homeScoresOnTop) {
				scoreRows = 
					<tbody>
						{homeRow}
						{awayRow}
					</tbody>;
			} else {
				scoreRows = 
					<tbody>
						{awayRow}
						{homeRow}
					</tbody>;
			}

            return (
                <div className="segment-scores">
                    <table>
                        <thead>
                        <tr>
                            <td></td>
                            {headerTds}
                        </tr>
                        </thead>
							{scoreRows}
                    </table>
                </div>
            );

        }
    });

}(window, document, jQuery || jQuerySL, SCRIBBLE));