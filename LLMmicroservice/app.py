from flask import Flask, request, jsonify
from openai import OpenAI
from api_key import key

app = Flask(__name__)

# Securely load your OpenAI API key

@app.route('/analyze', methods=['POST'])
def analyze_comment():
    data = request.json
    comment = data.get('comment')
    if not comment:
        return jsonify({"error": "No comment provided"}), 400

    try:
        # Generate prompt for sentiment analysis and keyword extraction
        prompt_text = f"Please analyze the sentiment of the following comment about a class and rate it from 0 (very negative) to 100 (very positive). Also, extract up to three key phrases that summarize the main issues or topics of the comment. Return should follow this structure: 'Sentiment score: 87. Keywords: homework, workload, challenging'."

        # Making a request to OpenAI's API  
        client = OpenAI(api_key=key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                "role": "system",
                "content": prompt_text
                },
                {
                "role": "user",
                "content": comment
                }
            ],
            temperature=0.7,
            max_tokens=64,
            top_p=1
        )

        print(response.choices[0].message.content)
        

        # Extract the text response
        text_response = response.choices[0].message.content
        # Process text_response to extract sentiment and keywords
        sentiment_score, keywords = process_response(text_response)
        print(sentiment_score, " ", keywords)
        return jsonify({"sentiment": sentiment_score, "keywords": keywords})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_response(text):
    # You need to parse the text based on how you've instructed the model to format its response
    # This is a mock-up and should be tailored to the actual output format
    sentiment_score = extract_sentiment_score(text)
    keywords = extract_keywords(text)
    return sentiment_score, keywords

def extract_sentiment_score(text):
    # Extract sentiment score from the text
    # The sentiment score follows the pattern "Sentiment score: [score]."
    try:
        start = text.find("Sentiment score: ") + len("Sentiment score: ")
        end = text.find(". Keywords: ")
        sentiment_score = int(text[start:end].strip())
        return sentiment_score
    except (ValueError, IndexError) as e:
        print(f"Error extracting sentiment score: {e}")
        #return 0  # Return a default or error score if parsing fails

def extract_keywords(text):
    # Extract keywords from the text
    # Keywords are listed after "Keywords: " and are separated by commas
    try:
        start = text.find("Keywords: ") + len("Keywords: ")
        keywords = text[start:].split(', ')
        return keywords
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        #return []  # Return an empty list if parsing fails


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
