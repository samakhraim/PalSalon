import { successResponse } from "../../utils/apiResponse.js"
import customerService from "./customer.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listCustomers = asyncHandler(async (req, res) => {
  const customers = await customerService.listCustomers()

  return successResponse(res, {
    message: "Customers fetched successfully",
    data: { customers },
  })
})

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id)

  return successResponse(res, {
    message: "Customer fetched successfully",
    data: { customer },
  })
})

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Customer created successfully",
    data: { customer },
  })
})

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body)

  return successResponse(res, {
    message: "Customer updated successfully",
    data: { customer },
  })
})

export const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.params.id)

  return successResponse(res, {
    message: "Customer deleted successfully",
  })
})

export const toggleCustomerStatus = asyncHandler(async (req, res) => {
  const customer = await customerService.toggleCustomerStatus(req.params.id)

  return successResponse(res, {
    message: "Customer status updated successfully",
    data: { customer },
  })
})
