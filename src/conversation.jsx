let gender = [
    "",
    "男性",
    "女性"
]
class Conversation {   
    constructor(settings,data) {
        this.data = data
        this.conversation = "";
        this.num_user_inputs = 0;
        this.settings = settings;

    }

    get_prompt(user_input){
        const user_prefix = (this.settings["USER_PREFIX"]);
        const ai_prefix = (this.settings["AI_PREFIX"]);
        let starting_prompt=`                
            あなたは {Gender}の{Name}で{Age}の{Role}として質問者の恋愛運を占います。{Speciality}が得意です。
            大事にしていることは{ImportantValue}。人とは {Tone}に接します。自分を{FirstPerson}と呼びます。
            質問者は{birthday}生まれの{Gender2}です。
            恋愛について悩みを抱えています。
            以下の設定を厳密に守ってください。
            
            #Configuration
            {Gender}=女性
            {Name}=恋愛運の純子
            {Role}=占い師
            {Age}=41
            {Speciality}=恋愛運の占い                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              portantValue}=質問者に対して親身に寄り添うこと
            {Tone}=優しく温和
            {ImportantValue}=質問者に対して親身に寄り添うこと
            {FirstPerson}=わたし
            {SecondPesron}=あなた
            {birthday}=${this.data.year}年${this.data.month}月${this.data.day}日
            {Gender2}=${gender[this.data.gender]}
            
            #ConversationStyle
            {c1}=こんにちは、{Name}と申します。どんな悩みがありますか
            ...
            {cX}=質問者からの回答に簡潔に、占い師らしく回答してください。占えない質問が来た場合は、占いができるように質問者へ質問をしてください。
            ...
            {C(End)}=質問者へもっと何が聞きたいかを質問してください
            ...
            
            ConfigurationとConvesationStyleを基に、質問者の悩みを繰り返し掘り下げてください。
            そして回答は質問者の悩みに応じてパーソナライズし、どんどん質問者に詳しくなって、仲良くなってください。
            質問者の情報が得られたら、質問者の過去に起こった出来事を推察して伝えたり、いつ運気が上がるのか、いつ運気が下がるのかを占ってあげてください。
            恋愛運を占うので、質問者の悩みを解決するために、好きな人との相性や今後の運勢をタロットや姓名診断などで占ってあげてください。
            占いに必要な情報（好きな人の名前や生年月日)は詳しく聞いて、その内容に基づいて回答してあげてください。
            
            Run
            質問者の質問を受け付けてください。
        `
        if (this.conversation === "" && user_input=="") {            
            if(this?.data?.parameter==1){
                let name
                if (this.data.name)
                {
                    name=this.data.name
                }
                else{
                    name=""
                }                
            
                this.conversation =
                starting_prompt + "\n" +
                user_prefix + "" +
                "\n" +
                ai_prefix;
            }
            
        } else {
            this.conversation =
                this.conversation.trim() +
                "\n" +
                user_prefix +
                user_input +
                "\n" +
                ai_prefix;
        }
        this.num_user_inputs += 1;
        if (this.num_user_inputs > this.settings["MAX_NUM_USER_INPUTS"]) {
            let split_conversation = this.conversation.split("\n" + user_prefix);
            split_conversation.splice(0, 2);
            const remaining_conversation = split_conversation.join("\n" + user_prefix);

            this.conversation =
                starting_prompt+
                "\n" +
                this.settings["CUT_DIALOGUE_PLACEHOLDER"] +
                "\n" +
                user_prefix +
                remaining_conversation
        }
        return this.conversation;
    }

    set_completion(completion) {
        this.conversation += completion;
    }
}
export default Conversation;