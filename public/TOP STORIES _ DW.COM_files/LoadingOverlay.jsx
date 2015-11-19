(function (React, $S) {

    var Scoreboards = $S.Scoreboards || {};

    Scoreboards.LoadingOverlay = React.createClass({
        render: function () {
            var template = null;

            if (this.props.visible) {
                template = <div className="loading-overlay">
                    <div className="display-table loading-overlay-table">
                        <div className="display-table-row">
                            <div className="display-table-cell loading-overlay-text">
                                <div className="loading">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
            }

            return template;
        }
    });

})(React, SCRIBBLE || (SCRIBBLE = {}));