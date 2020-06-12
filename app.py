from copy import copy
import json

import jsonpickle
import numpy
from scipy.spatial import distance
from xml.dom import minidom

from bunch import bunchify
import pysmile
import locale
import classes
import pysmile_license

import simplejson
from flask import Flask, request, jsonify
import time

import global_variables as gv

start_time = time.time()

app = Flask(__name__)


# this creates the json object for more complex structures
def transform(my_object):
    jsonpickle.enable_fallthrough(False)
    jsonpickle.set_preferred_backend('simplejson')
    jsonpickle.set_encoder_options('simplejson', sort_keys=True, ignore_nan=True)
    return jsonpickle.encode(my_object, unpicklable=False)


def update_cases(network):
    evidence_cases = minidom.parse(gv.evidence_cases_resource_string)
    cases = evidence_cases.getElementsByTagName('case')

    gv.service_evidence_cases.cases = cases

    for case in cases:
        if case.attributes['name'].value == gv.evidence_case:
            evidences = case.getElementsByTagName('evidence')
            for evidence in evidences:
                node = evidence.attributes['node'].value
                state = evidence.attributes['state'].value

                network.set_evidence(node, state)
                network.update_beliefs()
    return network


# initialize network
def initialize_network():
    network = pysmile.Network()
    network.read_file(gv.file_string)

    return update_cases(network)


gv.service_evidence_cases = classes.ServiceEvidenceCases(cases=None)

gv.net = initialize_network()
gv.net_original = initialize_network()


def print_node_info(network, node_handle):
    print("Node id/name: " + network.get_node_id(node_handle) + "/" + network.get_node_name(node_handle))

    print("  Outcomes: " + " ".join(network.get_outcome_ids(node_handle)))

    parent_ids = network.get_parent_ids(node_handle)

    if len(parent_ids) > 0:
        print("  Parents: " + " ".join(parent_ids))

    child_ids = network.get_child_ids(node_handle)

    if len(child_ids) > 0:
        print("  Children: " + " ".join(child_ids))


@app.route('/update_case/', methods=["POST"])
def update_case():
    start_time_deviations = time.time()

    gv.evidence_case = request.get_json()

    print(request.get_json())
    for node_handle in gv.net.get_all_nodes():
        gv.net.clear_evidence(node_handle)
        gv.net_original.clear_evidence(node_handle)

    gv.net = update_cases(gv.net)
    gv.net_original = update_cases(gv.net_original)
    print("--- %s seconds ---" % (time.time() - start_time_deviations))
    return transform(True)


@app.route('/get_node_count/', methods=["GET"])
def get_node_count():
    start_time_deviations = time.time()
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return transform(gv.net.get_node_count())


def create_node_obj_multiple_states(net, net_old, nodeid):
    state_objects = get_states(net, nodeid)
    state_objects_old = get_states(net_old, nodeid)

    all_states = []
    all_states.append(state_objects)

    all_observed = []

    is_evidence = net.is_evidence(nodeid) or net.is_virtual_evidence(nodeid)
    all_observed.append(is_evidence)

    if net != net_old:
        all_states.append(state_objects_old)
        all_observed.append(net_old.is_evidence(nodeid) or net_old.is_virtual_evidence(nodeid))

    child_ids = net.get_child_ids(nodeid)
    parent_ids = net.get_parent_ids(nodeid)

    node_object = classes.NodeObjectMultipleStatesLong(id=nodeid, name=nodeid, index="1", states=all_states,
                                                       is_observed=all_observed, children_ids=child_ids,
                                                       parents_ids=parent_ids)

    return node_object


@app.route("/get_node_object_with_virtual_evidences/", methods=["POST"])
def get_node_object_with_Virtual_Evidences():

    node_ids = request.get_json().get("node_ids", "")

    virtual_evidence_objects_readout = request.get_json().get("virtualEvidenceObjects", "")

    virtual_evidence_objects = []
    if len(virtual_evidence_objects_readout) > 0:
        for virtual_evidence_object in virtual_evidence_objects_readout:
            id_ = virtual_evidence_object.get("id", "")
            values = [float(i) for i in virtual_evidence_object.get("values", "")]

            virtual_evidence_objects.append(classes.VirtualEvidenceObject(id_=id_, values=values))

    node_ids_virtual_evidence_object = classes.NodeIdsVirtualEvidenceObject(node_ids=node_ids, virtual_evidence_objects=virtual_evidence_objects)

    net_all = copy(gv.net)
    net_no_virtual = copy(gv.net_original)

    net_all.update_beliefs()
    net_no_virtual.update_beliefs()

    node_ids = node_ids_virtual_evidence_object.node_ids

    list_node_objects = []

    for index_node in range(len(node_ids)):
        nodeid_ = node_ids[index_node]

        node_name = gv.net.get_node_name(nodeid_)
        state_objects_old = get_states(net_no_virtual, nodeid_)
        state_objects = get_states(net_all, nodeid_)

        all_states = []
        all_states.append(state_objects)

        all_observed = []
        is_evidence = net_all.is_evidence(nodeid_) or net_all.is_virtual_evidence(nodeid_)

        all_observed.append(is_evidence)

        if gv.virtual_evidences:
            all_states.append(state_objects_old)
            all_observed.append(net_no_virtual.is_evidence(nodeid_) or net_no_virtual.is_virtual_evidence(nodeid_))
        child_ids = net_all.get_child_ids(nodeid_)
        parent_ids = net_all.get_parent_ids(nodeid_)

        node_object = classes.NodeObjectMultipleStatesLong(name=node_name, id=nodeid_, index= 1, states= all_states,
                                                           is_observed=all_observed, children_ids=child_ids, parents_ids=parent_ids)

        child_nodes = []
        parent_nodes = []

        for i in range(len(child_ids)):
            child_nodes.append(create_node_obj_multiple_states(net_all, net_no_virtual, child_ids[i]))

        for i in range(len(parent_ids)):
            parent_nodes.append(create_node_obj_multiple_states(net_all, net_no_virtual, parent_ids[i]))

        list_node_objects.append(node_object)

    return transform(list_node_objects)


@app.route('/get_node_list_from_net_by_name_patientid_version/', methods=["GET"])
def get_node_list_from_net_by_name_patientid_version():
    start_time_deviations = time.time()

    net = copy(gv.net)
    node_list = []

    for node_handle in net.get_all_nodes():

        is_evidence = False

        if net.is_evidence(node_handle) or net.is_virtual_evidence(node_handle):
            is_evidence = True

        # node_number_in_network, id, node name, isTarget, is_evidence
        ar_list = [node_handle, net.get_node_id(node_handle), net.get_node_name(node_handle),
                   net.is_target(node_handle), is_evidence]
        node_list.append(ar_list)

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return transform(node_list)
    # return jsonify(node_list)


def get_states(net, nodeid):
    # update smile net:
    net.update_beliefs()

    # Get node information:
    outcome_ids = []
    try:
        outcome_ids = net.get_outcome_ids(nodeid)
    except Exception:
        print('exception')
        outcome_ids = []

    state_objects = []

    for i in range(len(outcome_ids)):

        state_object = classes.StateObject(outcome_ids[i], round(net.get_node_value(nodeid)[i], 4))
        state_objects.append(state_object)

    return state_objects


def compute_jensen_shannon_divergence(state_1, state_2):
    p1 = []
    p2 = []

    for i in range(len(state_1)):
        p1.append(float(state_1[i].probability))
        p2.append(float(state_2[i].probability))

    jen_shan = distance.jensenshannon(p1, p2)

    if numpy.isnan(jen_shan):
        jen_shan = 0

    return jen_shan


def compute_relevancies_for_outcome_states(state_1, state_2):
    all_rel_objects_for_current_node = []

    point_obj = classes.PointObject(index=0, relevance=0, x=state_1[0].name)

    for i in range(len(state_1)):

        prob_diff = float(state_2[i].probability) - float(state_1[i].probability)
        rel_obj = classes.RelevanceObject(state=state_1[i].name, relevance=prob_diff)

        all_rel_objects_for_current_node.append(rel_obj)

        if prob_diff > point_obj.relevance:
            point_obj.index = i
            point_obj.relevance = 0
            point_obj.x = state_1[i].name

    return all_rel_objects_for_current_node


def compute_point(state_1, state_2):
    point_obj = classes.PointObject(index=0, relevance=0, x=state_1[0].name)

    for i in range(len(state_1)):
        prob_diff = float(state_2[i].probability) - float(state_1[i].probability)

        if prob_diff > point_obj.relevance:
            point_obj.index = i
            point_obj.relevance = prob_diff
            point_obj.x = state_1[i].name

    return point_obj


@app.route('/get_influence_of_evidences_on_target/', methods=["POST"])
def get_influence_of_evidences_on_target():
    start_time_deviations = time.time()

    node_ids = request.get_json().get("node_ids", "")

    virtual_evidence_objects_readout = request.get_json().get("virtualEvidenceObjects", "")

    virtual_evidence_objects = []
    if len(virtual_evidence_objects_readout) > 0:
        for virtual_evidence_object in virtual_evidence_objects_readout:
            id_ = virtual_evidence_object.get("id", "")
            values = [float(i) for i in virtual_evidence_object.get("values", "")]

            virtual_evidence_objects.append(classes.VirtualEvidenceObject(id_=id_, values=values))

    node_ids_virtual_evidence_object = classes.NodeIdsVirtualEvidenceObject(node_ids=node_ids, virtual_evidence_objects=virtual_evidence_objects)

    bn_clone_initial = copy(gv.net)
    bn_clone_no_virtual = copy(gv.net_original)

    target_ids = node_ids_virtual_evidence_object.node_ids

    targets_with_final_evidences = []

    all_relevance_of_evidence_objects = []

    #     get probabilites of target ids with final evidences
    for i in range(len(target_ids)):
        state_objects_old = get_states(bn_clone_no_virtual, target_ids[i])
        state_objects = get_states(bn_clone_initial, target_ids[i])

        all_states = [state_objects, state_objects_old]

        targets_with_final_evidences.append(classes.NodeIDWithStateObjects("final", all_states))

    node_list_with_evidences = get_all_evidences(True)

    sum_of_all_overall_relevancies = 0

    for i in range(len(target_ids)):
        for evidence_node in node_list_with_evidences:
            net = copy(gv.net)
            net.update_beliefs()

            node_id = evidence_node[1]

            rel_of_ev_obj = classes.RelevanceOfEvidenceObject(node_id=evidence_node[1], node_label=evidence_node[2],
                                                              states=None, overall_relevance=None, relevancies=None,
                                                              lines=None, point=None, is_virtual_evidence=None,
                                                              resulting_in_max_state_change=None,
                                                              max_state_with_current_evidence=None,
                                                              max_state_without_current_evidence=None,
                                                              is_observed=None)
            state_objects = get_states(bn_clone_initial, node_id)

            all_states = [state_objects]

            all_observed = [bn_clone_initial.is_evidence(node_id) or bn_clone_initial.is_virtual_evidence(node_id)]

            if gv.virtual_evidences:
                state_objects_old = get_states(bn_clone_no_virtual, node_id)
                all_states.append(state_objects_old)
                all_observed.append(bn_clone_no_virtual.is_evidence(node_id) or bn_clone_no_virtual.is_virtual_evidence(node_id))

            rel_of_ev_obj.states = all_states
            rel_of_ev_obj.isObserved = all_observed

            net.clear_evidence(evidence_node[1])
            net.update_beliefs()

            rel_of_ev_obj.is_virtual_evidence = gv.net.is_virtual_evidence(node_id)

            target_for_current_node = get_states(net, target_ids[i])

            jensen_shannon_value = compute_jensen_shannon_divergence(target_for_current_node, targets_with_final_evidences[i].stateObjects[0])

            rel_of_ev_obj.relevancies = compute_relevancies_for_outcome_states(target_for_current_node,
                                                                               targets_with_final_evidences[i].stateObjects[0])

            rel_of_ev_obj.point = compute_point(target_for_current_node, targets_with_final_evidences[i].stateObjects[0])
            rel_of_ev_obj.overall_relevance = jensen_shannon_value

            rel_of_ev_obj.resulting_in_max_state_change = False
            rel_of_ev_obj.max_state_with_current_evidence = ""
            rel_of_ev_obj.max_state_without_current_evidence = ""

            max_state_all_evidences = ""
            max_prob_all_evidences = -1
            max_state_current_evidences = ""
            max_prob_current_evidences = -1

            for max_state_index in range(len(target_for_current_node)):
                if max_prob_all_evidences < float(targets_with_final_evidences[0].stateObjects[0][max_state_index].probability):
                    max_prob_all_evidences = float(targets_with_final_evidences[0].stateObjects[0][max_state_index].probability)
                    max_state_all_evidences = targets_with_final_evidences[0].stateObjects[0][max_state_index].name

                if max_prob_current_evidences < float(target_for_current_node[max_state_index].probability):
                    max_prob_current_evidences = float(target_for_current_node[max_state_index].probability)
                    max_state_current_evidences = target_for_current_node[max_state_index].name

            if max_state_all_evidences != max_state_current_evidences:
                rel_of_ev_obj.resulting_in_max_state_change = True
                rel_of_ev_obj.max_state_with_current_evidence = max_state_all_evidences
                rel_of_ev_obj.max_state_without_current_evidence = max_state_current_evidences

            sum_of_all_overall_relevancies += jensen_shannon_value

            all_lines = []

            for lines_i in range(len(rel_of_ev_obj.relevancies)-1):
                line = classes.LinesObject(x0=rel_of_ev_obj.relevancies[lines_i].state,
                                           x1=rel_of_ev_obj.relevancies[lines_i+1].state,
                                           relevance0=rel_of_ev_obj.relevancies[lines_i].relevance,
                                           relevance1=rel_of_ev_obj.relevancies[lines_i+1].relevance)

                all_lines.append(line)

            rel_of_ev_obj.lines = all_lines

            all_relevance_of_evidence_objects.append(rel_of_ev_obj)

    for i in range(len(all_relevance_of_evidence_objects)):
        new_overall_relevance_in_percentage = all_relevance_of_evidence_objects[i].overall_relevance / \
                                              sum_of_all_overall_relevancies

        if numpy.isnan(new_overall_relevance_in_percentage):
            new_overall_relevance_in_percentage = 0

        all_relevance_of_evidence_objects[i].overall_relevance = float(new_overall_relevance_in_percentage)

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return transform(all_relevance_of_evidence_objects)


@app.route('/get_all_evidences/', methods=["GET"])
def get_all_evidences(*inside_call):
    start_time_deviations = time.time()
    list_of_all_evidences = []

    net = copy(gv.net)
    for node_handle in net.get_all_nodes():
        if net.is_virtual_evidence(node_handle) or net.is_evidence(node_handle):
            list_of_all_evidences.append([node_handle, net.get_node_id(node_handle),
                                          net.get_node_name(node_handle), net.is_target(node_handle), True])
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    if inside_call:
        return list_of_all_evidences

    return jsonify(transform(list_of_all_evidences))


@app.route('/get_all_observable_nodes/', methods=["GET"])
def get_all_observable_nodes():
    start_time_deviations = time.time()

    net_all = copy(gv.net)

    list_all_observable_nodes = []
    for node_handle in net_all.get_all_nodes():
        if net_all.get_node_diag_type(node_handle) > 0:  # 0 = target, 1 = observation, 2 = not defined
            list_all_observable_nodes.append(classes.ObservableNodeIdsAndObserved(id_=net_all.get_node_id(node_handle),
                                                                                  name=net_all.get_node_name(node_handle),
                                                                                  is_evidence=net_all.is_evidence(node_handle),
                                                                                  is_virtual_evidence=net_all.is_virtual_evidence(node_handle)))
    print("--- %s seconds ---" % (time.time() - start_time_deviations))
    return transform(list_all_observable_nodes)


@app.route('/update_evidences/', methods=["POST"])
def update_evidences():
    start_time_deviations = time.time()

    node_ids = request.get_json().get("node_ids", "")
    virtual_evidence_objects_readout = request.get_json().get("virtualEvidenceObjects", "")

    virtual_evidence_objects = []
    if len(virtual_evidence_objects_readout) > 0:
        for virtual_evidence_object in virtual_evidence_objects_readout:
            id_ = virtual_evidence_object.get("id", "")
            values = [float(i) for i in virtual_evidence_object.get("values", "")]

            virtual_evidence_objects.append(classes.VirtualEvidenceObject(id_=id_, values=values))

    node_ids_virtual_evidence_object = classes.NodeIdsVirtualEvidenceObject(node_ids=node_ids, virtual_evidence_objects=virtual_evidence_objects)

    net = copy(gv.net)

    net.clear_all_evidence()
    net.update_beliefs()

    used_case = classes.CaseObject(evidences=None, name=None)

    for i in range(len(gv.service_evidence_cases.cases)):

        if gv.service_evidence_cases.cases[i].attributes['name'].value == gv.evidence_case:
            used_case = gv.service_evidence_cases.cases[i]

    try:
        evidences = used_case.getElementsByTagName('evidence')
        for i in range(len(evidences)):
            #     // check whether the observed node is observable
            if net.get_node_diag_type(evidences[i].attributes['node'].value) > 0:
                net.set_evidence(evidences[i].attributes['node'].value, evidences[i].attributes['state'].value)

    except Exception as inst:
        return jsonify(False)

    net.update_beliefs()

    gv.net = net

    virtual_evidences_findings = node_ids_virtual_evidence_object.virtualEvidenceObjects

    if virtual_evidences_findings is not None:
        gv.virtual_evidences = True

        if len(virtual_evidences_findings) == 0:
            gv.virtual_evidences = False

        for finding in virtual_evidences_findings:
            try:
                net.set_virtual_evidence(finding.id, finding.values)
            except Exception as s:
                print(s)
                continue

    else:
        gv.virtual_evidences = False

        gv.net = copy(gv.net_original)

    net.update_beliefs()
    gv.net = net

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(True)


def get_virtual_evidence_objects():
    virtual_evidence_objects = []
    net_all = copy(gv.net)

    for node_handle in gv.net.get_all_nodes():

        if net_all.is_virtual_evidence(node_handle):
            virtual_evidence_objects.append(node_handle)

    return virtual_evidence_objects


@app.route('/get_target_nodes/', methods=["POST"])
def get_target_nodes():
    start_time_deviations = time.time()

    net_all = copy(gv.net)
    net_no_virtual = copy(gv.net_original)

    net_all.update_beliefs()
    net_no_virtual.update_beliefs()

    node_ids = request.get_json().get("node_ids", "")

    list_node_objects = []

    for node_id_ in node_ids:

        state_objects_old = get_states(net_no_virtual, node_id_)
        state_objects = get_states(net_all, node_id_)

        all_states = [state_objects]

        all_observed = []
        is_evidence = net_all.is_evidence(node_id_) or net_all.is_virtual_evidence(node_id_)

        node_name = net_all.get_node_name(node_id_)
        all_observed.append(is_evidence)
        if len(get_virtual_evidence_objects()) > 0:
            all_states.append(state_objects_old)
            all_observed.append(net_no_virtual.is_evidence(node_id_) or net_no_virtual.is_virtual_evidence(node_id_))

        node_object = classes.NodeObjectMultipleStates(node_id_, node_name, all_observed, all_states)

        list_node_objects.append(node_object)
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(list_node_objects))


# get_node_list_from_net_by_name_patientid_version()
# get_node_count()

# gv.net.set_virtual_evidence('Survival1yr', [1, 0])
# gv.net.update_beliefs()
# target_string = ["Therapy", "Histology"]
# get_target_nodes(target_string)
# get_all_observable_nodes()

# print(gv.net.get_virtual_evidence('Survival1yr'))
# beliefs = gv.net.get_node_value("Survival1yr")
# for i in range(0, len(beliefs)):
    # print(gv.net.get_outcome_id("Survival1yr", i) + "=" + str(beliefs[i]))


@app.route('/')
def hello():
    return "Hello World!"


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response


@app.route('/')
def index():
    """ Displays the index page accessible at '/'
    """
    return Flask.render_template('templates/index.html')

# @app.route('/')
# def list_of_included_functions():
#     return "Following functions are included: '/update_case/', '/get_node_count/, " \
#            "'get_node_list_from_net_by_name_patientid_version/', 'get_target_nodes/"


if __name__ == '__main__':
    app.debug = True
    app.run()
    port = 5000  # the custom port you want
    app.run(host='127.0.0.1', port=port)

# if __name__ == '__main__':
#     # app.run(debug=True)
#     port = 5000  # the custom port you want
#     app.run(host='127.0.0.1', port=port)
