import sqlite3
import json

# Conexão com o banco SQLite
conn = sqlite3.connect("extraction_results2023.08.07_anonymized.db")  # Substitua pelo caminho do seu banco
cursor = conn.cursor()

# Executa a consulta para obter os dados
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
    cr.initial_period BETWEEN '2016.1' AND '2018.2'
GROUP BY 
    c.id, c.name, cr.initial_period
ORDER BY 
    c.name, cr.initial_period;
"""
cursor.execute(query)
results = cursor.fetchall()

# Estruturar os nodos e links
nodes = []
links = []

# Para rastrear índices dos nodos e valores cumulativos
node_index = {}
previous_node_index = None
cumulative_students = {}

# Função auxiliar para adicionar nodos
def add_node(name):
    if name not in node_index:
        node_index[name] = len(nodes)
        nodes.append({"name": name})
    return node_index[name]

# Processar os resultados da query
for course_name, period, students_in in results:
    # Calcula o acumulado cumulativo
    cumulative_students[course_name] = cumulative_students.get(course_name, 0) + students_in
    cumulative_node_name = f"{course_name} - {period} (Cumulativo: {cumulative_students[course_name]})"
    
    # Adicionar nodo para o período cumulativo
    cumulative_node_index = add_node(cumulative_node_name)
    
    # Conectar ao período anterior (se existir) para o mesmo curso
    if previous_node_index is not None and previous_course_name == course_name:
        links.append({
            "source": previous_node_index,
            "target": cumulative_node_index,
            "value": students_in
        })
    
    # Atualiza para o próximo loop
    previous_node_index = cumulative_node_index
    previous_course_name = course_name

# Fecha a conexão com o banco
conn.close()

# Gera o JSON final
sankey_data = {"nodes": nodes, "links": links}
print(json.dumps(sankey_data, indent=4, ensure_ascii=False))
