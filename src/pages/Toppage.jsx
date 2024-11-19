function TopPage() {
    var userData =  JSON.parse(localStorage.getItem("userData")) || null;
    return(
        <main>
            <div className="home bg">
                <div className="container">
                    <h1 className="home-ttl">
                        AI占い
                    </h1>
                    <div className="home-txt">
                        AI占い師があなたの運勢を占います。
                    </div>
                    <figure>
                        <img src="./assets/images/favicon.png" alt=""/>
                    </figure>
                    <a href="/start" className="btn btn-common">START</a>
                    {!userData && <a href="/login" className="anchor">会員の方はこちら</a>}
                    <div className="footer">
                        <a href="https://essaapps.com/law/">特定商取引法に基づく表記</a>
                        <a href="https://essaapps.com/">運営会社</a>
                    </div>
                </div>
                
            </div>
        </main>
    )
}
export default TopPage;