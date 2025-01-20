from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Função para obter os dados do Sankey
def get_sankey_data(start_period, end_period):
    conn = sqlite3.connect("extraction_results2023.08.07_anonymized.db")
    cursor = conn.cursor()
    
    query = """
    SELECT 
        c.name AS course_name,
        cr.initial_period AS period,
        COUNT(*) AS students_in
    FROM 
        curriculums cr
    JOIN 
        courses c ON cr.course_id = c.id
    WHERE 
        cr.initial_period BETWEEN ? AND ?
    GROUP BY 
        c.id, c.name, cr.initial_period
    ORDER BY 
        c.name, cr.initial_period;
    """
    
    cursor.execute(query, (start_period, end_period))
    results = cursor.fetchall()
    conn.close()

    nodes = []
    links = []
    node_index = {}
    cumulative_students = {}

    def add_node(name):
        if name not in node_index:
            node_index[name] = len(nodes)
            nodes.append({"name": name})
        return node_index[name]

    previous_period = None
    for course_name, period, students_in in results:
        cumulative_students[course_name] = cumulative_students.get(course_name, 0) + students_in
        cumulative_node_name = f"{course_name} - {period} (Cumulativo: {cumulative_students[course_name]})"
        current_node_index = add_node(cumulative_node_name)
        
        if previous_period and previous_period[0] == course_name:
            previous_node_name = f"{course_name} - {previous_period[1]} (Cumulativo: {cumulative_students[course_name] - students_in})"
            if previous_node_name in node_index:
                links.append({
                    "source": node_index[previous_node_name],
                    "target": current_node_index,
                    "value": students_in
                })
        
        previous_period = (course_name, period)

    return {"nodes": nodes, "links": links}

# Rota para o endpoint GET do Sankey
@app.route('/sankey', methods=['GET'])
def sankey():
    # Obtém os parâmetros da URL
    start_period = request.args.get("start_period")
    end_period = request.args.get("end_period")
    
    if not start_period or not end_period:
        return jsonify({"error": "start_period and end_period are required"}), 400

    sankey_data = get_sankey_data(start_period, end_period)
    return jsonify(sankey_data)

if __name__ == '__main__':
    app.run(debug=True)
